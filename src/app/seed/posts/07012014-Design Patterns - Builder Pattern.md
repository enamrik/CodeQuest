Separate the construction of a complex object from its representation so that the same construction process can create different representations.

This means that you might have objects of different types that are built in the same way and you'd prefer not to duplicate the construction logic for each type. 

    //let's imagine inheritance is out of the picture
    //(GuiWindow is sealed) and property setting is our
    //only option. The builder pattern helps us organize
    //the setting of properties by window style

    sealed class GuiWindow{
      public Color BgColor{get;set;}
      public Font Font{get;set;}
      public string Title{get;set;}
    }
    
    abstract class WindowBuilder{
      protected GuiWindow window = new GuiWindow();
      public GuiWindow Window{get{return window;}}

      abstract WindowBuilder SetStyling();
      abstract WindowBuilder SetTitle(string title);
    }
    
    class ClassicWindowBuilder:WindowBuilder{
      public WindowBuilder SetStyling(){
        window.BgColor = classicColor;
        window.Font = classicFont;
        return this;
      }
    
      public WindowBuilder SetTitle(string title){
        window.Title = "Classic: " + title;
        return this;
      }
    }

    class ModernWindowBuilder:WindowBuilder{
      public WindowBuilder SetStyling(){
        window.BgColor = modernColor;
        window.Font = modernFont;
        return this;
      }
    
      public WindowBuilder SetTitle(string title){
        window.Title = "Modern: " + title;
        return this;
      }
    }
 
    //factory method for builder
    static WindowBuilder GetBuilderFor(string type){
       return type == 'classic' 
         ? new ClassicWindowBuilder()
         : new ModernWindowBuilder();
    }

    //Director
    static GuiWindow GetWindow(
      string type, 
      string name){

      var builder = GetBuilderFor(type);
      builder.SetStyling();
      builder.SetTitle(name);
      return builder.Window;
    }
   





