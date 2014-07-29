In my previous post on [testing private methods](http://codequest.net/posts/testing-private-methods), I wrote about alternative approaches to consider when tempted to test private methods. This week I found another great alternative made possible by simple having a better testing framework. Consider this class:


	class RabbitClient
	  def initialize(args)
	    @url = args.rabbitmq_api_url
	    @username = args.rabbitmq_username
	    @password = args.rabbitmq_password
	  end
	
	  def create_vhost(name)
	    put("vhosts/#{name}")
	  end
	
	  def create_user(name)
	    put("users/#{name}")
	  end
	
	  private
	  def put(path, body = nil)
	    url = URI.parse absolute_url_for(path)
	    http_request = Net::HTTP::Put.new(url)
	    http_request.basic_auth @username, @password
	    http_request.body = body
	    perform_request url.host, url.port, http_request
	  end
	
	  def perform_request(host, port, http_request)
	    Net::HTTP.start(host, port) { |http| 
		  http.request(http_request) 
        }
	  end

      def absolute_url_for(path)
      	File.join(@url, path)
      end
	end

Both **create\_user** and **create\_vhost** use the same **put** method just with different paths/end points. What we really want to test here is the **put** method because it has all the behavior. We could solve this by moving the **put** method into a generic WebClient class which the RabbitClient would use. The problem is we don't care to do that refactoring right now or ever depending on the requirements. 

So what do we do? Well when you think about it, both **create\_user** and **create\_vhost** "behave like" HTTP put requests. So what makes the most sense is to run the same tests that cover the **put** method against both **create\_user** and **create\_vhost**. Now in some testing frameworks, that means duplicating the test code but in Rspec, we have the awesome **it\_should\_behave_like** feature. Check it out:

	describe 'RabbitClient' do
	  shared_examples_for "an HTTP put request" do
	    let(:http_request) { stub_everything() }
	    let(:client) {create_client http_request}

	    it 'should authenticate with username and password' do
	      request_method.call(client)
	      expect(http_request).
			to have_received(:basic_auth).
			with('username', 'password').
			at_least_once
	    end
	
	    it 'should perform request with host and port' do
	      request_method.call(client)
	      expect(client).
			to have_received(:perform_request).
			with('test.com', 15672, anything).
			at_least_once
	    end
	  end
	
	  describe '#create_vhost' do
	    it_should_behave_like "an HTTP put request" do
	      let(:request_method) { proc { |c| c.create_vhost('new_host')} }
	    end
	  end

	  describe '#create_user' do
	    it_should_behave_like "an HTTP put request" do
	      let(:request_method) { proc { |client| c.create_user('new_user')} }
	    end
	  end
	end
 