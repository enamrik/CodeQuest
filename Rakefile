require 'rubygems'
require 'bundler/setup'

require_relative 'scripts/deployment'

desc 'build production image'
task :build_prod, [:up_version] do |_, args|
    args.with_defaults(up_version: false)
    Deployment.new.build_prod_image args[:up_version]
end

desc 'run prod'
task :run_prod do
    Deployment.new.run_prod
end

desc 'debug prod'
task :debug do
  Deployment.new.debug_prod
end

task default: [:debug]