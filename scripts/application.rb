class Application
    class << self
        def name
            'codequest'
        end

        def named_version
            "#{name}_v#{Version.current}"
        end

        def next_named_version
            "#{name}_v#{Version.next}"
        end
    end
end