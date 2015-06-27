require 'docker'
require_relative 'application'
require_relative 'version'
require 'fileutils'

class Deployment
  attr_reader :app_path, :docker, :app_port

  def initialize
    @app_port = 3000
    @docker = Docker.new ports: [app_port, 8090, 5858]
    @app_path = File.expand_path("#{File.dirname(__FILE__)}/../")
    @prod_container_name = 'codequest_prod'
  end

  def package
    build_prod_image_if_not_build

    puts 'Building production tarball...'
    directory_name = File.expand_path('~/releases')
    Dir.mkdir(directory_name) unless File.exists?(directory_name)
    docker.exec("save -o #{directory_name}/codequest-#{Version.current}.tar #{Application.named_latest}")
  end

  def run_prod
    build_prod_image_if_not_build
    docker.run(@prod_container_name, "-d -p #{app_port}:#{app_port} #{Application.named_version}", remove_if_exists: true)
  end

  def debug_prod
    build_prod_debug_image
    docker.run('codequest_prod_debug', 
               "-v #{app_path}/src:/src -d -P -p 8090:8090 -p 5858:5858 -p #{app_port}:#{app_port} codequest_prod_debug",
               remove_if_exists: true)
    
    puts "\n"
    puts 'Container codequest_prod_debug is now running node-inspector against a prod image.'
    puts 'Go to http://127.0.0.1:8090/debug?port=5858 to to access node-inspector.'
    puts 'Run "source ./scripts/debug_prod.sh" to start codequest in container codequest_prod_debug in debug mode.'
  end
  
  def build_prod_debug_image
    build_prod_image_if_not_build
    image_name = 'codequest_prod_debug'

    unless docker.image_exists? image_name
      puts "Building #{image_name} image..."
      docker.build("-t #{image_name} #{app_path}/scripts/debug_prod")
    end
  end
  
  def build_prod_image_if_not_build
    unless docker.image_exists? Application.named_version
      puts "Production image #{Application.named_version} hasn't been build yet. Building..."
      build_prod_image
    end
  end

  def build_prod_image(up_version = false)
    docker.remove_container @prod_container_name

    prod_image_name = prod_image_name up_version
    docker.remove_image prod_image_name
    puts "Building #{prod_image_name} image..."
    docker.build("-t #{prod_image_name} #{app_path}/src")
    docker.tag_as_latest prod_image_name
    Version.up if up_version
  end

  def prod_image_name(up_version)
    up_version ? Application.next_named_version : Application.named_version
  end
end