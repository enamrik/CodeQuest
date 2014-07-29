The Decorator pattern is used to extend or modify the behavior of 'an instance' at runtime. This pattern is
suited for situations where we can't or don't want to modify the existing object but 1) we want to alter the behavior of existing public methods or 2) we want to add new methods that will be auto detected by consumers. 

In the following, we decorate a TextBox with validation behavior. The ViewEngine then uses reflection to populate the Validation Message element with the TextBox's validation result if the TextBox has been decorated. 

    class TextBox{
      public string Text{get;set;}
    }
    
    abstract class Decorator : TextBox{
      protected TextBox textBox;
    
      public Decorator(TextBox textBox){
        this.textBox = textBox;
      }
    }
    
    class Validator : Decorator, IValidator {
    	public string ErrorMessage {get;set;}
      
      public void Validate(){
        /*validation logic*/
      }
    }
    
    <TextBox Text=""Hello World"">
      <ValidationMessage/>
    </TextBox>;