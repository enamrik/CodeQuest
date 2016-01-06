Spring Boot Auto-configuration woes
=====================
I've spent the last 8 months working in Java. This was my first time working with Spring; the defacto framework for 
building web application. More specifically, my team used Spring Boot. Spring Boot, as far as I can tell, is a 
convention-over-configuration layer over Spring. For every Spring extension - JPA, Spring Security, etc. - Spring Boot
provides "auto-configurations". An Auto-configuration is usually a set of spring beans that are automatically registered
with Spring's bean factory (Spring's Dependency Injection piece) when you

1) include the appropriate Spring Boot jar on the class path 
2) put the appropriate annotation on the appropriate class
3) set the appropriate property in your application.properties file

And a few other ways that are even more elusive like whether or not you have or may not have a been with the appropriate 
name registered.

My team started out very excited about just how much functionality could be added to our application  with very little
effort. Three months down the road, the started the pain. 

The first gotcha came when adding a new service to our micro-service architecture. The new service's maven module was 
created, migration scripts written and everything looked good. The new service was deployed into our dev environment and
all looked well. One day, a developer went to query data from the tables and noticed there was no data! This was strange
as we had integration tests and we thought there were tests that should be failing. It turns out that we had accidentally
left a particular dependency on the class which was causing all our JPA repositories to write into an in-memory database.
No data was being persisted to disk. Now, putting aside the fact that the developer pair should have caught that before
considering the feature completed, this shouldn't be possible. Some sane defaults are in fact, pretty insane.

On another occasion, a developer needed to use a type from a particular library so he/she brought it into one of our
micro services. Inadvertently, the entire service was locked down with basic authentication. How? Spring Boot noticed a
certain type in a transitive dependency and auto-configured basic authentication. Once again, a disciplined developer 
would've have caught this before pushing code to master. But that's just to great a side effect to be brought in via
auto-configuration. 

After these and other issues, we refined out Spring Boot auto-configuration approach. Now every auto configuration
component is explicitly brought in by a single configuration class or an application property. This means to active 
any Spring Boot component, it must first be registered in our configuration class, and if we need to control the 
component on process start up, then the that property was be configurated with the component in the configuration class.

We've not had any issues since then. Explicit is good. Auto-configuration is great so we didn't want to go back to 
configuring a million properties ourselves. What we wanted is explicit control over a set of implicit behavior 


Libraries vs Frameworks
======================
I've never been a fan of frameworks. The reason is frameworks are by their nature trying to solve several problems at
the same time. This means there are several layers of abstractions to support code being used many different use cases.
This also means there's alot more code which means alot more code to read and understand. Most developers think
they shouldn't be reading framework source code but I'm not one of those developers. Just because someone wrote and
maintains the code for me, doesn't mean I'm not going to understand what's actually going on. 

The other problem with frameworks is you can only extend or customize the execution flow within the bounds of what the 
framework chooses to expose. This means developers are always waiting on framework developers to provides hooks into 
the framework. Now that is to be expected. 




