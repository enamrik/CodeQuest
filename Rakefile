require 'rubygems'
require 'bundler/setup'

require_relative 'scripts/dev_server'
require_relative 'scripts/deployment'

desc 'prepare environment and start development server'
task :start_dev_server do
    DevServer.new.start
end

desc 'build base image'
task :build_base_image do
    BaseImage.new.build_if_missing
end

desc 'build production image'
task :deploy_to_prod, [:up_version] do |_, args|
    args.with_defaults(up_version: false)
    Deployment.new.build_prod_image args[:up_version]
end

desc 'run local prod build'
task :run_prod do
    Deployment.new.try_prod_locally
end

task default: [:start_dev_server]