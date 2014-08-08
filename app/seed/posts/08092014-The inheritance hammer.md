Ever heard the expression "when all you have is a hammer, everything looks like a nail"? Of course you have. In the modern age of DRY and re-usability, inheritance has become the hammer of the gods. In several teams I've been on, inheritance is the first tool out of the toolbox once any amount of duplication is identified. "These two properties and this method are on the same two classes? They should be of the same base type!". New  base class and pull up refactoring on the spot! "Oh wait, this third object only shares this property and this other method with just one of the previous two. Oh I see! These two share a base class that itself sub-classes the root base class! You know what to do people!".

Inheritance is NOT the only tool for code reuse and being DRY. As a matter of fact it's not even one of the good ones. More often than not, code duplication can be solved by a plethora of other patterns that are way more flexible and representative of the problem at hand.

###Inheritance gone wrong

Take for example this case where help text needed to be displayed on hover for all UIControls on a form. The task was handed to Sam the intern. Sam was quick to notice that all UIControls needed help text and proceeded to add a HelpKey and HelpText property to the UIControl base class. 

    abstract class UIControl{
      protected helpText;
      
      public virtual string HelpKey{get;set;}

      public virtual HelpText{
        get{return helpText;}
        set{helpText = value;}
      }
    }

When the form opens, two things happen: 1) The help text is set for each UIControl by querying the resources collection by key and 2) we listen to the hover and blur events of all UIControls: 


    void Init(){
      this.Controls.ForEach(c => {
        c.HelpText = Resources[c.HelpKey];
        c.Hover += OnHover;
      });
    }
    
    void OnHover(UIControl control, EventArgs args){
      helpTextView.Text = control.HelpText;
      helpTextView.SetPosition(control.Position);
      helpTextView.Show();
    }

    void OnBlur(UIControl control, EventArgs args){
      helpTextView.Hide();
    }

Simple enough. It worked pretty well too and would have been fine but the story doesn't end there. Turns out that help texts for buttons and labels were going to need to be transformed on the fly based on the current user's role. Sam noticed that UILabel and UIButton inherited from UIControl and had an ingenious idea:

    abstract class UserTransformedHelpText: UIControls{
      protected User CurrentUser{get;set;}

      public override string HelpText{
        get{return helpText;}
        set{helpText = Transform(value);}
      }
      private string Transform(){
        /*Do something with current user and helpText*/
      }
    }

    class UIButton : UserTransformedHelpText{}
    class UILabel : UserTransformedHelpText{}

Next thing you know, Sam is being asked to take the intro part of the help text for user transformed help texts and only apply it when hovering over UIFields or UILabels:

    abstract class UserTransformIntroHelpText: UIControls{}

    abstract class UserTransformedHelpText: UserTransformIntroHelpText{}

    class UIButton : UserTransformedHelpText{}

    class UILabel : UserTransformIntroHelpText{}

    class UIField : UserTransformIntroHelpText {}

Why is this the wrong refactoring? Well it looks like help text generation is going to be changing a lot. But this has nothing to do with UIControls! So why keep touching UIControls to make room for more variations on help text generation? Also the way help text is evolving, inheritance doesn't really seem to fit the mold; the user seems to want to mix and match components of the help text.

The decorator pattern might have been a better choice:

    void OnHover(UIControl control, EventArgs args){
      helpTextView.Text = helpTextFactory.CreateFor(control).Text;
      helpTextView.SetPosition(control.Position);
      helpTextView.Show();
    }

    class HelpTextFactory{ 
      private User currentUser;

      public HelpTextFactory(User user){
        this.currentUser = user;
      }
      public HelpText CreateFor(UIControl control){
        var helpText = new HelpText(Resources[control.HelpKey]);

        if (control is UIButton || control is UILabel){
          helpText = new UserDecorator(helpText, currentUser); 
        }
        if(control is UIField || control is UILabel){
          helpText = new IntroDecorator(helpText); 
        }
        return helpText;
      }
    }

    class HelpText{
      public string Text{get;private set;}

	  public HelpText(string text){
        Text = text;
      }
    }

    abstract class Decorator : HelpText{
      protected HelpText helpText;
      public abstract string Text{get;}

      public Decorator(HelpText helpText){
        this.helpText = helpText;
      }
    }

    class IntroDecorator : Decorator {
      public IntroDecorator(HelpText helpText)
        :base(helpText){}

      public override string Text{
        get{return AddInto(helpText.Text);}
      }
      private string AddInto(string text){
        /*add intro to help text*/
      }
    }

    class UserDecorator : Decorator{
      private User currentUser;

      public UserDecorator(HelpText helpText, User currentUser)
        :base(helpText){
         this.currentUser = currentUser;
      }
      public override string Text{
        get{return ForUser(helpText.Text);}
      }
      private string ForUser(string text){
        /*Do something with current user and helpText*/
      }
    }

Or maybe even a list of visitors that each get a chance to modify the help text as needed:

    class HelpTextFactory {
      private List<Func<Type,IVistor>> visitorFactories;
      private User currentUser;

      public HelpTextFactory(User user){
        this.currentUser = user;
        visitorFactories = new Dictionary<Type, Func<Type,IVistor>>{
          t => new UserVistor(t, currentUser),
          t => new IntroVistor(t)
        };
      }

      public HelpText CreateFor(UIControl control){
        var helpText = new HelpText(Resources[control.HelpKey]);
        visitorFactories.ForEach(f => f(control.GetType()).Visit(helpText));
        return helpText;
      }
    }

    abstract class Visitor{
      //if in your domain, the visitor should not know about
      // the type of UIControl, in the factory method, have
      // a map from UIControl type to visitors and only allow
      // visitors to visit the types they should
      protected Type controlType;

      public Visitor(Type controlType){
        this.controlType = controlType;
      }
      abstract void Visit(HelpText helpText);
    }

    UserVistor : Visitor{/*you get the picture*/}
    IntroVistor : Visitor{/*you get the picture*/}


###Behavior vs. Type

First thing to understand is just because two objects exhibit similar behavior doesn't mean they belong in the same family of objects. A method that is duplicated on two objects doesn't mean that method belongs on a base class that those two objects inherit from. That duplication could mean several things depending on the context, and depending on the context, several patterns could be used to eliminate that duplication. 

###Alternatives to Inheritance

There are many alternatives to inheritance and they require you to understand your domain:

1. **Composition** - If two objects share similar properties and methods, move those properties and methods to a new class and have the original objects store a property of the new class instead. This makes sense when the two objects really only behave the same way but aren't really of the same family.
1. **Delegation** - If the duplicated method is doing alot of work on a particular composed object, move that method to the composed object and delegate to it.
1. **Helpers** - Move the duplicated methods to static classes. Reach for extension methods first.
1. **Invert the Relationship** - Move the duplicated methods to a new type that takes in objects of the types that contained the duplicated methods
1. **Design Patterns** - One of the primary reasons for design patterns is to deal with duplication. Read a book on design patterns and you'll find yourself reaching for many more tools before you reach for inheritance!

The list goes on...

So my advice is that there's an entire toolbox of patterns at our disposal so let's use the right tool for the job.
 