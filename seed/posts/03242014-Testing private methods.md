Testing private methods is a bad idea. I'm sure you've heard this already, agreed with the arguments but found what seemed to be exceptions to the rule. So we end up using one of the methods for testing private methods:

 1. making the private method public
 2. making the private method protected then creating an inherited class with a public test method that will call the protected method
 3. Using reflection to call the private method   
 
But overtime I've learned to rethink these exceptional cases and I've realized that the desire to test private methods is actually a sign of problematic code i.e. a code smell. In fact, 90% of the time, most of the logic in the private method needs to either be 1) moved to a new class or 2) moved to the domain entity to which it belongs.

Take for example the following:

    public class Reporter{
      public Result Build(){
        return GenerateReport(false);    
      }

      public Result Preview(){
        return GenerateReport(true);
      }

      private Results GenerateReport(bool preview){
        if(preview) {/*you get the point*/}
        else {/*you get the point*/} 
      }
    }

**Build()** and **Preview()** both use **GenerateReport()** which itself has a lot going on. At first, it might seem that we should test **GenerateReport()** directly. It's definitely safer than picking one of the public methods to test. If **Build()** was chosen as our hook into **GenerateReport()** and **Build()** suddenly no longer needed to call **GenerateReport()**, we would need to remember to switch **Preview()** to be the new hook. Instead of testing **GenerateReport()** directly, we can solve our problem with this refactoring:

	public class Reporter{
	  public Result Build(){
	    builder.AddLiveHeader();
	    return BuildBody();
	  }
	
	  public Result Preview(){
	    builder.AddPreviewHeader();
	    return BuildBody();
	  }
	
	  private Builder BuildBody(){
	    builder.Body();
	    return builder.Build();
	  }
	}

We got rid of a method that was taking in a flag and doing too much and replaced it with a new class that we can test outside the **Reporter**. Also notice that the above refactoring is less procedural. The more procedural our code, the more often we run into private methods that seem like they need to be tested in isolation.

In this next example, we have a private method **AddCostItem()** that's performing validation logic.

	public class PizzaOrder{
	  private List<CostItem> CostItems{get;set;}
	
	  public void AddTopping(Topping topping){
	    AddCostItem(side);
	  }
	  public void AddSide(Side side){
	    AddCostItem(side);
	  }
	
	  private IErrors AddCostItem(CostItem costItem){

        var validation = Validate(costItem);

	    if(validation.IsValid){
          CostItems.Add(costItem);
        }
        return validation;
	  }
	}

**AddTopping()** and **AddSide()** are both calling **AddCostItem()**. To avoid repeating the same validation tests for both **AddTopping()** and **AddSide()**, we might want to test **AddCostItem()** by itself. But why not make the **CostItem** capable of validating itself?

    public abstract CostItem{
	  public IErrors Validate(){
	    /*some kind of validation*/
	  }
	}

 Now **AddCostItem()** no longer has to worry about validation. The validation logic and the logic to *not* add an invalid **CostItem** has been abstracted out, tested separately and is now completely reusable without duplication.

	  private IErrors AddCostItem(CostItem costItem){
	    return costItem.Validate().AndIfValid(x => CostItems.Add(x));
	  } 

You might have noticed a theme. When a private method contains branching logic and is called by two or more public methods, we find ourselves feeling the need to test this private method directly. At that moment, remember to first consider the following:

1. Pull the private method logic into a new class
2. Make the private method into an extension method on the type it consumes/mutates
3. Move private method to the domain entity. To find the right domain entity, observe the type that the private method seems most obsessed with 
