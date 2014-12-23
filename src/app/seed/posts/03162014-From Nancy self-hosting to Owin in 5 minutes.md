I just moved CodeQuest from being hosted via **Nancy.Hosting.Self** to an **OWIN** server (Katana's HttpListener) in just under 5 minutes. I have a Server project which is a simple Console application that listens on port 80. My actual Nancy application lives in another project in the same solution. I was able to make a few changes in my Server project's only file (see below) to switch out my entire hosting stack! This is a credit to both the flexibility of Nancy and OWIN. The whole process is laid out [here](https://github.com/NancyFx/Nancy/wiki/Hosting-nancy-with-owin "here").

In case you're wondering, OWIN is a specification for decoupling Web infrastructure (i.e. hosts, servers, middleware and applications). Katana is Microsoft's implementation of OWIN. My decision to move CodeQuest to OWIN was based on me needing to use OWIN middleware such as SignalR. 

Sorry but I don't have great tools for code coloring and git diffs yet. They're on the way.

     using System;
	-using Nancy.Hosting.Self;
	+using Microsoft.Owin.Hosting;
	+using Owin;

	 namespace CodeOasis.Server {
		 class Program {
	-        private const string Url = "http://localhost:80";
	+        private const string Url = "http://+:80";
	        
	         static void Main() {
	-            using(var host = new NancyHost(new Uri(Url))) {
	-                host.Start();
	+            using(WebApp.Start<Startup>(Url)) {
	                 Console.WriteLine("Running on {0}", Url);
	                 Console.WriteLine("Press enter to exit");
	                 Console.ReadLine();
				 }
			 }
		 }
	+
	+    public class Startup {
	+        public void Configuration(IAppBuilder app) {
	+            app.UseNancy();
	+        }
	+    }
	 }