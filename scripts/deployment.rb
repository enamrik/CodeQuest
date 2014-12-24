class Deployment
    attr_accessor :app_path, :docker, :keep_version

    def initialize(options = {})
        @keep_version = options[:keep_version]
        @docker = Docker.new ports: [80]
        @app_path = File.expand_path("#{File.dirname(__FILE__)}/../")
    end

    def deploy_to_prod
        build_prod_image
        Version.up unless keep_version
    end

    def build_prod_image
        app_folder = "#{app_path}/src"
        deploy_folder = "#{app_path}/prod_app_image"

        excludes = "--exclude=container_entrypoint.sh --exclude=Dockerfile --exclude=app/content"
        puts "Copying files to container folder..."
        `rsync -a #{excludes}  #{app_folder}/ #{deploy_folder}`

        docker.remove_image prod_image_name
        puts "Building #{prod_image_name} image..."
        docker.build("-t #{prod_image_name} #{app_path}/prod_app_image")
    end

    def prod_image_name
        keep_version ? Application.named_version : Application.next_named_version
    end
end