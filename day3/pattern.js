var calculator = (function() {
	var exports = {};

	function bar(a) {
		return a+1;
	}

	function foo(a,b) {
		return bar(a)+b;

	}

	exports.foo=foo;

	return exports;
}());

/* if the file is called calculator....

<script src="calculator.js"></script>

... calculator.foo(3,4) ... */
