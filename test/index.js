// Fake DOM
global.document = require( 'jsdom' ).jsdom( '', {
	features: {
		FetchExternalResources: false,
		ProcessExternalResources: false,
		SkipExternalResources: true
	}
} );
global.window = document.defaultView;
global.navigator = window.navigator;

// Dependencies
const { expect } = require( 'chai' );
const { parse, attr, prop, html, text, query } = require( '../dist/hpq' );

describe( 'hpq', () => {
	// Markup
	const markup = '<blockquote><p>…</p><p>…</p><cite class="large"><em>—</em> Andrew</cite></blockquote>';

	// Element
	let element = document.createElement( 'div' );
	element.innerHTML = markup;
	element = element.firstChild;

	describe( 'parse()', () => {
		it( 'should return undefined if passed no matchers', () => {
			const result = parse( markup );

			expect( result ).to.be.undefined;
		} );

		it( 'should accept a string of markup as source', () => {
			const result = parse( markup, text( 'cite' ) );

			expect( result ).to.equal( '— Andrew' );
		} );

		it( 'should return matcher value if passed function matcher', () => {
			const result = parse( element, text( 'cite' ) );

			expect( result ).to.equal( '— Andrew' );
		} );

		it( 'should return undefiend if passed matchers other than object, function', () => {
			const result = parse( element, 2 );

			expect( result ).to.be.undefined;
		} );

		it( 'should return parsed matches in shape of matcher object', () => {
			const result = parse( element, {
				author: text( 'cite' )
			} );

			expect( result ).to.eql( {
				author: '— Andrew'
			} );
		} );
	} );

	describe( 'attr()', () => {
		it( 'should return a matcher function', () => {
			const matcher = attr();

			expect( matcher ).to.be.a( 'function' );
		} );

		it( 'should return undefined if selector does not match', () => {
			const result = parse( element, attr( 'strong', 'class' ) );

			expect( result ).to.be.undefined;
		} );

		it( 'should return undefined if match does not have attribute', () => {
			const result = parse( element, attr( 'cite', 'data-unknown' ) );

			expect( result ).to.be.undefined;
		} );

		it( 'should return attribute value of match', () => {
			const result = parse( element, attr( 'cite', 'class' ) );

			expect( result ).to.equal( 'large' );
		} );
	} );

	describe( 'prop()', () => {
		it( 'should return a matcher function', () => {
			const matcher = prop();

			expect( matcher ).to.be.a( 'function' );
		} );

		it( 'should return property of current top node if no selector', () => {
			const result = parse( element, prop( undefined, 'nodeName' ) );

			expect( result ).to.equal( 'BLOCKQUOTE' );
		} );

		it( 'should return undefined if selector does not match', () => {
			const result = parse( element, prop( 'strong', 'nodeName' ) );

			expect( result ).to.be.undefined;
		} );

		it( 'should return property of selector match by property', () => {
			const result = parse( element, prop( 'cite', 'nodeName' ) );

			expect( result ).to.equal( 'CITE' );
		} );
	} );

	describe( 'html()', () => {
		it( 'should return a matcher function', () => {
			const matcher = html();

			expect( matcher ).to.be.a( 'function' );
		} );

		it( 'should return inner HTML of top node if no selector', () => {
			const result = parse( element, html() );

			expect( result ).to.match( /^<p>/ );
		} );

		it( 'should return inner HTML of selector match', () => {
			const result = parse( element, html( 'cite' ) );

			expect( result ).to.equal( '<em>—</em> Andrew' );
		} );
	} );

	describe( 'text()', () => {
		it( 'should return a matcher function', () => {
			const matcher = text();

			expect( matcher ).to.be.a( 'function' );
		} );

		it( 'should return text content of top node if no selector', () => {
			const result = parse( element, text() );

			expect( result ).to.match( /^…/ );
		} );

		it( 'should return text content of selector match', () => {
			const result = parse( element, text( 'cite' ) );

			expect( result ).to.equal( '— Andrew' );
		} );
	} );

	describe( 'query()', () => {
		it( 'should return a matcher function', () => {
			const matcher = query();

			expect( matcher ).to.be.a( 'function' );
		} );

		it( 'should return array of parse on matched nodes', () => {
			const result = parse( element, { text: query( 'p', text() ) } );

			expect( result ).to.eql( {
				text: [ '…', '…' ]
			} );
		} );
	} );
} );
