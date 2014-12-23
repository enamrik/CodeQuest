require 'open3'

module Command

    def self.run(command, options = {})
        Commander.new.run command, options
    end

    class Commander
        def run(command, options)
            data = {:out => [], :err => []}
            exit_status = 0

            Open3.popen3(command) do |stdin, stdout, stderr, thread|

                Thread.new do
                  until (raw_line = stderr.gets).nil? do
                    if options[:stream_out] then puts "e: #{raw_line}" end
                    data[:err] << raw_line
                  end
                end

                Thread.new do
                  until (raw_line = stdout.gets).nil? do
                    if options[:stream_out] then puts "=>: #{raw_line}" end
                    data[:out] << raw_line
                  end
                end

                thread.join
                exit_status = thread.value.exitstatus
            end

            if not exit_status == 0
                if options[:stream_out]
                    raise "EXCEPTION: error occurred"
                else
                    raise "EXCEPTION: \n#{data[:err].join}"
                end
            end

             data[:out].join
        end
    end
end