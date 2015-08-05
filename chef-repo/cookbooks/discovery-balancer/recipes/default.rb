include_recipe 'consul::install_binary'
include_recipe 'consul::ui'
include_recipe 'consul-template::default'
include_recipe 'haproxy::default'

file '/etc/haproxy/haproxy.cfg' do
  action :delete
end

consul_service_def 'codequest' do
  id 'codequest1'
  port 5050
  # address '192.168.1.3'
  tags ['http']
  # check(
  #     interval: '10s',
  #     http: 'http://localhost:5050/health'
  # )
  notifies :reload, 'service[consul]'
end

http_request 'haproxy-max-connections' do
  url 'http://localhost:8500/v1/kv/service/haproxy/maxconn'
  action :put
  message '4000'
end

http_request 'haproxy-mode' do
  url 'http://localhost:8500/v1/kv/service/haproxy/mode'
  action :put
  message 'http'
end

http_request 'haproxy-timeouts-connect' do
  url 'http://localhost:8500/v1/kv/service/haproxy/timeouts/connect'
  action :put
  message '10000'
end

http_request 'haproxy-timeouts-client' do
  url 'http://localhost:8500/v1/kv/service/haproxy/timeouts/client'
  action :put
  message '300000'
end

cookbook_file '/etc/haproxy/haproxy.cfg.ctmpl' do
  source 'haproxy.cfg.ctmpl'
  action :create
end

consul_template_config 'haproxy' do
  templates [{
                 source: '/etc/haproxy/haproxy.cfg.ctmpl',
                 destination: '/etc/haproxy/haproxy.cfg',
                 command: 'service haproxy restart'
             }]
  notifies :reload, 'service[consul-template]', :delayed
end
