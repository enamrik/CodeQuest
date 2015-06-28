execute 'docker-login' do
  command "docker login -e #{node['docker_hub']['email']} -p \"#{node['docker_hub']['password']}\" -u #{node['docker_hub']['username']}"
end

execute 'codequest-pull-image' do
  command 'docker pull enamrik/codequest:latest'
end

execute 'codequest-run' do
  command 'docker run --name codequest -d -p 80:3000 enamrik/codequest:latest'
  not_if 'docker ps | grep -i codequest'
end