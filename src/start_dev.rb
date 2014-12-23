#!/bin/ruby

Dir["../scripts/*.rb"].each {|file| require file }

class StartDev
    attr_accessor :docker, :base_image

    def initialize
        @docker = Docker.new
        @base_image = BaseImage.new docker
    end

    def execute
        docker.setup_with ports: [3000, 8080, 5858, 8081]
        base_image.build_if_missing

        unless docker.image_exists? 'codequest_dev'
            puts "codequest_dev image hasn't been built yet. Building..."
            docker.build("-t codequest_dev #{File.dirname(__FILE__)}")
        end

        if docker.container_exists? 'codequest_dev'
            puts "Removing codequest_dev container..."
            docker.exec('rm -f codequest_dev')
        end

        puts "Dev environment ready! Starting tty container..."
        context_path = File.expand_path(File.dirname(__FILE__))
        docker.run("--rm -ti -P -p 3000:3000 -p 8080:8080 -p 5858:5858 -v #{context_path}:/src --name codequest_dev codequest_dev")
        puts "Stopping tty container..."
    end
end

StartDev.new.execute






