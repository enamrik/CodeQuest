#!/bin/ruby

class StartDev
    attr_accessor :docker, :base_image

    def initialize
        @docker = Docker.new
        @base_image = BaseImage.new docker
    end

    def execute
        docker.setup_with ports: [3000, 8080, 5858]
        base_image.build_if_missing

        create_dev_image
        remove_existing_container
        create_run_container
    end

    def create_run_container
        puts "Dev environment ready! Starting tty container..."
        app_path = File.expand_path("#{File.dirname(__FILE__)}/../src")
        docker.run("--rm -ti -P -p 3000:3000 -p 8080:8080 -p 5858:5858 -v #{app_path}:/src --name codequest_dev codequest_dev")
        puts "Stopping tty container..."
    end

    def remove_existing_container
        if docker.container_exists? 'codequest_dev'
            puts "Removing codequest_dev container..."
            docker.exec('rm -f codequest_dev')
        end
    end

    def create_dev_image
        unless docker.image_exists? 'codequest_dev'
            puts "codequest_dev image hasn't been built yet. Building..."
            context_path = File.expand_path(File.dirname(__FILE__))
            docker.build("-t codequest_dev #{context_path}")
        end
    end
end







