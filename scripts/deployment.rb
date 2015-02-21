require 'docker'
require_relative 'application'
require_relative 'version'

class Deployment
    attr_reader :app_path, :docker, :app_port

    def initialize
        @app_port = 80
        @docker = Docker.new ports: [app_port]
        @app_path = File.expand_path("#{File.dirname(__FILE__)}/../")
    end

    def try_prod_locally
        docker.run(Application.name, "--rm -it -P -p 3000:#{app_port} #{Application.named_version}", remove_if_exists: true)
    end

    def build_prod_image(up_version)
        app_folder = "#{app_path}/src"
        deploy_folder = "#{app_path}/prod_app_image"

        excludes = '--exclude=container_entrypoint.sh --exclude=Dockerfile --exclude=app/content'
        puts 'Copying files to container folder...'
        `rsync -a #{excludes}  #{app_folder}/ #{deploy_folder}`

        prod_image_name = prod_image_name up_version
        docker.remove_image prod_image_name
        puts "Building #{prod_image_name} image..."
        docker.build("-t #{prod_image_name} #{app_path}/prod_app_image")
        Version.up if up_version
    end

    def prod_image_name(up_version)
        up_version ? Application.next_named_version : Application.named_version
    end
end