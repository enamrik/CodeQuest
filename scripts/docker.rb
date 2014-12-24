class Docker
    def initialize(options = {})
        setup_boot2docker_ports(options[:ports] || [])
        setup_docker_environment
    end

    def build(params)
        exec("build #{params}", stream_out: true)
    end

    def run(params)
        exec("run #{params}", stream_out: true)
    end

    def image_exists?(image_name)
        exec('images').include? image_name
    end

    def remove_image(image_name)
        if image_exists? image_name
            puts "Removing #{image_name} image..."
            exec("rmi #{image_name}")
        end
    end

    def container_exists?(container_name)
        exec('ps -a').include? container_name
    end

    def remove_container(container_name)
        if container_exists? container_name
            puts "Removing #{container_name} container..."
            exec("rm -f #{container_name}")
        end
    end

    def exec(command, options = {})
        cmd = "docker #{command}"
        puts "DOCKER: #{cmd}"
        Command.run(cmd, options)
    end

    @private

    def setup_docker_environment
        puts "Setting up docker environment variables..."
        Command.run('boot2docker shellinit')
            .split("\n")
            .select{|line| line.include?'export'}
            .each {|line|
                env_parts = line.sub('export','').split('=')
                ENV[env_parts.first.strip] = env_parts[1]
            }
    end

    def setup_boot2docker_ports(ports_needed)
        ports_to_expose = ports_needed.reject {|port|
            port_forward_entry_exists_for port
        }

        if ports_to_expose.any?
            puts "Could not find port forward entries #{ports_to_expose.join(", ")}. Preparing to add..."

            if boot2docker_running?
                puts 'Shutting down VM...'
                Command.run('boot2docker down')
            end

            ports_to_expose.each do|port|
                puts "Adding port forward entry #{port}..."
                Command.run("VBoxManage modifyvm \"boot2docker-vm\" --natpf1 \"tcp-port#{port},tcp,,#{port},,#{port}\"")
            end
        end

        unless boot2docker_running?
            puts 'boot2docker VM not running. Booting VM...'
            Command.run('boot2docker up', stream_out: true)
        end
    end

    def port_forward_entry_exists_for(port)
        Command.run('VBoxManage showvminfo "boot2docker-vm"').include? "tcp-port#{port},"
    end

    def boot2docker_running?
        Command.run('boot2docker status').include? 'running'
    end
end
