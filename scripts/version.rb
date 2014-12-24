class Version
    class << self
        def current
            File.read(version_file)
        end

        def up
            puts "Updating version to #{Version.next}..."
            File.write version_file, Version.next.to_s
        end

        def next
            Version.current.to_i + 1
        end

        def version_file; "#{app_path}/src/version.txt" end

        def app_path
            File.expand_path("#{File.dirname(__FILE__)}/../")
        end
    end
end

