Define a family of algorithms and make them interchangeable (using an interface or base class).
Strategy allows the algorithm to vary independently from clients that use it. This means that
clients shouldn't take a dependency on an alogorithm implementation. Clients only work with an
abstraction (interface or base class).
 
    // Three contexts following different strategies
    context = new Context(new StrategyA());
    context = new Context(new StrategyB());
    context = new Context(new StrategyC());