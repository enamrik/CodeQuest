require 'rubygems'
require 'bundler/setup'

require_relative 'scripts/deployment'

desc 'Build production image, will delete existing image and build from scratch'
task :build_prod, [:up_version] do |_, args|
    args.with_defaults(up_version: false)
    Deployment.new.build_prod_image args[:up_version]
end

desc 'Run prod, will not rebuild automatically but will reuse existing image if found'
task :run_prod do
    Deployment.new.run_prod
end

desc 'Debug prod, will not rebuild automatically but will reuse existing image if found'
task :debug do
  Deployment.new.debug_prod
end

desc 'Create prod tarball'
task :package do
  Deployment.new.package
end

task default: [:debug]