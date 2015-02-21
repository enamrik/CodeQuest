require_relative 'version'

class Application
    class << self
        def name; 'codequest' end
        def author; 'enamrik' end

        def named_version
            "#{author}/#{name}:#{Version.current}"
        end

        def next_named_version
            "#{author}/#{name}:#{Version.next}"
        end
    end
end