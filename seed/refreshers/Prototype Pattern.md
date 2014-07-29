The Prototype pattern is most usefully when the cost of creating an object is expensive but parts of the code that make use of the object must have their own unique instances. It's more efficient to have a single instance (Prototype instance) perform the expensive initialization once, then give each consumer a clone of that instance which it can further initialize and then use.

    class LoanStatsSummary{
      ExpensiveData loansRawStats;
    
      public LoanStatsSummary(ExpensiveData stats){
        this.loansRawStats = stats;
      }

      public Clone(){
        /*create clone with initial state*/
        return new LoanStatsSummary(loansRawStats);
      }
      
      public void PrepareForDirectors(){
        /*modify state for paticular use case*/
      }
      public void PrepareForOfficers(){
        /*modify state for paticular use case*/
      }
    }
    
    class LoanStatsSummaryFactory{
      private Lazy<LoanStatsSummary> prototype;
      private Prototype{get{return prototype.Value;}}
    
      public LoanStatsSummaryFactory(){
        prototype = new 
         Lazy<LoanStatsSummary>(ExpensiveProcess);
      }
     
      public LoanStatsSummary NewSummary(){
        var summary = Prototype.Clone();
        /*maybe more initial state setup*/
        return summary;
      }

      private LoanStatsSummary ExpensiveProcess(){
        return new LoanStatsSummary(
         /*compute expensive loan raw stats*/);
      }
    }
    
    static void Main(){
      var factory = new LoanStatsSummaryFactory();

      var summary = factory.NewSummary();
      summary.PrepareForDirectors();
      PrintAsPieChart(summary);
    
      summary = factory.NewSummary();
      summary.PrepareForOfficers();
      PrintAsPivotTable(summary);
    }
    
    

