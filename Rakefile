Dir["./scripts/*.rb"].each {|file| require file }

desc "prepare environment and start development server"
task :start_dev_server do
    DevServer.new.start
end

desc "build base image"
task :build_base_image do
    BaseImage.new(Docker.new).build_if_missing
end

desc "deploy to production"
task :deploy_to_prod, [:up_version] do |task, args|
    args.with_defaults(up_version: false)
    Deployment.new.deploy_to_prod(keep_version: !args[:up_version])
end

desc "run local prod build"
task :run_prod do
    Deployment.new.try_prod_locally
end
