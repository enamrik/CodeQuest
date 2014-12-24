class Deployment
    attr_reader :app_path, :docker, :app_port

    def initialize
        @app_port = 80
        @docker = Docker.new ports: [app_port]
        @app_path = File.expand_path("#{File.dirname(__FILE__)}/../")
    end

    def try_prod_locally
        docker.remove_container Application.name
        docker.run("--rm -it -P -p 3000:#{app_port} --name #{Application.name} #{Application.named_version}")
    end

    def deploy_to_prod(options = {})
        build_prod_image options[:keep_version]
        Version.up unless options[:keep_version]
    end

    def build_prod_image(keep_version)
        app_folder = "#{app_path}/src"
        deploy_folder = "#{app_path}/prod_app_image"

        excludes = "--exclude=container_entrypoint.sh --exclude=Dockerfile --exclude=app/content"
        puts "Copying files to container folder..."
        `rsync -a #{excludes}  #{app_folder}/ #{deploy_folder}`

        prod_image_name = prod_image_name_if keep_version
        docker.remove_image prod_image_name
        puts "Building #{prod_image_name} image..."
        docker.build("-t #{prod_image_name} #{app_path}/prod_app_image")
    end

    def prod_image_name_if(keep_version)
        keep_version ? Application.named_version : Application.next_named_version
    end
end