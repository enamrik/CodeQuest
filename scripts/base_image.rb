class BaseImage
    attr_accessor :docker

    def initialize(docker)
        @docker = docker
    end
    def build_if_missing

        unless docker.image_exists? 'codequest_base'
            puts 'codequest_base image hasn\'t been built yet. Building...'
            context_path = File.expand_path("#{File.dirname(__FILE__)}/../base_image")
            docker.build("-t codequest_base #{context_path}")
        end
    end
end
