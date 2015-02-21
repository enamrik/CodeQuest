require 'docker'
require_relative 'application'

class BaseImage
    attr_accessor :docker

    def initialize
        @docker = Docker.new
    end
    
    def build_if_missing
        unless docker.image_exists? base_image_name
            puts "#{base_image_name} image hasn\'t been built yet. Building..."
            context_path = File.expand_path("#{File.dirname(__FILE__)}/../base_image")
            docker.build("-t #{base_image_name} #{context_path}")
        end
    end

    def base_image_name
        "#{Application.author}/codequest_base:#{version}"
    end

    def version
        1
    end
end
