Dir["./scripts/*.rb"].each {|file| require file }

desc "prepare environment and start development server"
task :start_dev_server do
    DevServer.new.start
end

desc "deploy to production"
task :deploy_to_prod do
    Deployment.new(keep_version: true).deploy_to_prod
end

desc "run local prod build"
task :run_prod do
    Docker.new(ports: [80])
        .run("--rm -it -p 80:80 #{Application.named_version}")
end
