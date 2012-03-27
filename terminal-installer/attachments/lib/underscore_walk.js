_.mixin({

	    /*
	     * (defn walk
	     *
	     "Traverses form, an arbitrary data structure.  inner and outer are
	     functions.  Applies inner to each element of form, building up a
	     data structure of the same type, then applies outer to the result.
	     Recognizes all Clojure data structures except sorted-map-by.
	     Consumes seqs as with doall."
	     {:added "1.1"}

	     [inner outer form]
	     (cond
	     (list? form) (outer (apply list (map inner form)))
	     (seq? form) (outer (doall (map inner form)))
	     (vector? form) (outer (vec (map inner form)))
	     (map? form) (outer (into (if (sorted? form) (sorted-map) {})
                                       (map inner form)))
	     (set? form) (outer (into (if (sorted? form) (sorted-set) #{})
                                       (map inner form)))
	     :else (outer form)))

	     */
	    //the transformer needs to take in 1 args
	    //it needs to return the transformed obj. noop = return first arg;
	    //refer to tests
	    newwalk:function(inner,outer,form){
		if(_.isArray(form)){
		    return outer(_.map(form,inner))
		}
		else if(_.isObject(form)){
		    return outer(_.map$(form,inner))
		}
		else{
		    return outer(form)
		}
	    },
	    /*
	     * (defn prewalk
	     "Like postwalk, but does pre-order traversal."
	     {:added "1.1"}

	     [f form]
	     (walk (partial prewalk f) identity (f form)))
	     */
	    prewalk:function(transformation,form){
		return _.newwalk(
		    _.curry(_.prewalk,transformation),
		    _.identity,
		    transformation(form)
		);
	    },
	    /*
	     * (defn prewalk-demo
	     "Demonstrates the behavior of prewalk by printing each form as it is
	     walked.  Returns form."
	     {:added "1.1"}
	     [form]
	     (prewalk
                      (fn [x] (print "Walked: ")
                              (prn x)
                              x)
                      form))
	     */
	    prewalk_demo:function(form){
		_.prewalk(
		    function(x){
			console.log("Walked: " + JSON.stringify(x,1));
			return x
		    },
		    form);
	    }
	});