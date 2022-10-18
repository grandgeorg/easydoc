---
tags: markdown, git, gitea
title: Sample Markdown
lang: en
created: '2021-10-31 10:20:27'
modified: '2021-10-31 10:20:45'
---

# Sample Markdown

<svg width="416" height="224" viewBox="0 0 52 28" class="logo gw-logo">
<path style="fill:#ff3300;stroke:#bf2600;stroke-width:0.75px;stroke-linecap:butt;stroke-linejoin:round;stroke-opacity:1" d="M 24,4 H 4 V 24 H 24 V 12 h -8 v 4 h 4 v 4 H 8 V 8 h 16 z"/>
<path style="fill:#267dff;stroke:#1d5ebf;stroke-width:0.75px;stroke-linecap:butt;stroke-linejoin:round;stroke-opacity:1" d="M 48,4 V 24 H 28 V 4 h 4 v 16 h 4 V 8 h 4 v 12 h 4 V 4 Z" />
</svg>

<svg width="156" height="84" viewBox="0 0 52 28" class="logo gw-logo">
<path style="fill:#ff3300;stroke:#bf260066;stroke-width:2px;stroke-linecap:butt;stroke-linejoin:round;stroke-opacity:1" d="M 24,4 H 4 V 24 H 24 V 12 h -8 v 4 h 4 v 4 H 8 V 8 h 16 z"/>
<path style="fill:#267dff;stroke:#1d5ebf66;stroke-width:2px;stroke-linecap:butt;stroke-linejoin:round;stroke-opacity:1" d="M 48,4 V 24 H 28 V 4 h 4 v 16 h 4 V 8 h 4 v 12 h 4 V 4 Z" />
</svg>

## Images

![Grandgeorg Websolutions](img/logo.png)

A Table
---------------

| Syntax      | Description |
| ----------- | ----------- |
| Header      | Title       |
| Paragraph   | Text        |
| foo         | bar         |

## Emphasis

*This text will be italic*
_This will also be italic_

**This text will be bold**
__This will also be bold__

_You **can** combine them_

## Lists

Here are some lists:

- maindomain for the website frontend
- subdomain with OmekaS
- subdomain with Bolt CMS

* Item 1
* Item 2
  * Item 2a
  * Item 2b

1. Item 1
2. Item 2
3. Item 3
   1. Item 3a
   1. Item 3b

## Blockquotes

As Kanye West said:

> We're living the future so
> the present is our past.

## Custom blocks

::: warning ⚠ Please note
__This is not supported by default markdown__
:::

## Jump to Chapter
See Chapter [SSL Certificate with Let's encrypt](#ssl-certificate-with-let-s-encrypt) or get wildcard certificate from ISP.

Here's a simple footnote,[^1] and here's a longer one.[^bignote]

### A Heading with custom id {#custom-id}

Just a chapter ... {.test #foobar}

## Definition Lists

First Term
: This is the definition of the first term.

Second Term
: This is one definition of the second term.
: This is another definition of the second term.

~~The world is flat.~~ We now know that the world is round.

## Task Lists

- [x] Write the press release
- [ ] Update the website
- [ ] Contact the media

## Emojis

🔥👍:heavy_check_mark::ballot_box_with_check::white_check_mark::x::closed_book::green_book:
:warning:
:construction: :-1:

## SHA references

Any reference to a commit’s SHA-1 hash will be automatically converted into a link to that commit on Gitea.

584eecbbfc82b193005d85ba6d905a6125317e84

## Issue references within a repository

#1
Viktor/test-hello-world#1

@Viktor this is a link to the gitea user.

### Apache Configuration Codeblock

```apacheconf
<VirtualHost *:80>
    ServerAdmin webmaster@localhost

    RewriteEngine On
    RewriteCond %{HTTP_HOST} ^(museum.de|www.museum.de) [NC]
    RewriteRule ^(.*)$ https://museum.de$1 [R=301,L]

    DocumentRoot /var/www/museum.de/public

    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```

### ASP Codeblock

```asp
<%
	'check for form submission and then allow 
	If Request.ServerVariables("REQUEST_METHOD") = "POST" Then
		fact = 1
		'get the value from input text box 'number'
		number = Request.form("number")
		Response.Write("Factorial of "+number+"<br><br>")
 
		For i = 1 to number
			'formula to calculate factorial is to 
			'multiply the iterator i value with fact value.			
			fact = fact * i
			
			'print fact to show the factorial pyramid
			'or put this line out of this 'for loop' to show only the total value
			Response.Write(fact)
			Response.Write("<br>")
		Next
	end if
%>
```

## C Codeblock

```c
int factorialSafe(int n) {
    int result = 1;
    if(n<0)
        return -1;
    for (int i = 1; i <= n; ++i)
        result *= i;
    return result;
}
```

## C++ Codeblock

```c++
#include <boost/iterator/counting_iterator.hpp>
#include <algorithm>
 
int factorial(int n)
{
  // last is one-past-end
  return std::accumulate(boost::counting_iterator<int>(1), boost::counting_iterator<int>(n+1), 1, std::multiplies<int>());
}
```

## C# Codeblock

```c#
using System;
 
class Program
{
    static int Factorial(int number)
    {
        if(number < 0) 
            throw new ArgumentOutOfRangeException(nameof(number), number, "Must be zero or a positive number.");
 
        return number == 0 ? 1 : number * Factorial(number - 1);
    }
 
    static void Main()
    {
        Console.WriteLine(Factorial(10));
    }
}
```

## Clojure Codeblock

```clojure
(defn factorial [x]
  (loop [x x
         acc 1]
    (if (< x 2)
        acc
        (recur (dec x) (* acc x)))))
```

## CSS Codeblock

```css
@supports (font-variation-settings: normal) {
  @font-face {
    font-family: "Encode Sans";
    src: url("/assets/fonts/EncodeSans.woff2") format("woff2");
    font-weight: 100 900;
    font-stretch: 75% 125%;
    font-style: normal;
  }

  $font-family-sans-serif: "Encode Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Noto Sans", "Liberation Sans", "Helvetica Neue", Arial, sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";

  body {
    font-family: "Encode Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Noto Sans", "Liberation Sans", "Helvetica Neue", Arial, sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    font-weight: 400;
  }
}

.burger {
  display: block;
  padding: 5px 10px;
  width: 43px;
  font-size: xx-small;
  line-height: 0.1;
  background-color: transparent;
  border: none;
  cursor: pointer;
  opacity: 0;
  animation-delay: 500ms;
  animation: BURGER_FADE_IN 1s linear forwards;
}

@keyframes BURGER_FADE_IN {
  0% {
    opacity: 0;
    transform: translateX(100%);
  }
  40% {
    transform: translateX(0);
  }
  to {
    opacity: 1;
  }
}

@media (min-width: 576px) {
  .address_search .card-group > .card:not(:first-child) {
    border-top-left-radius: 0.25rem;
    border-bottom-left-radius: 0.25rem;
  }
  .address_search .card-group > .card:not(:last-child) {
    border-top-right-radius: 0.25rem;
    border-bottom-right-radius: 0.25rem;
  }
  .address_search .card-group > .card + .card {
    border-left: 1px solid rgba(0, 0, 0, 0.125);
  }
}
```

## SCSS Codeblock

```scss
@mixin scrollbars($size, $foreground-color,  $foreground-color-hover, $background-color, $border-radius, $border-width) {

  // For Google Chrome
  &::-webkit-scrollbar {
    width: $size;
  }

  &::-webkit-scrollbar-thumb {
    background-color: $foreground-color;
    border-radius: $border-radius;
    border: $border-width solid $background-color
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: $foreground-color-hover;
  }

  &::-webkit-scrollbar-track {
    background-color: $background-color;
  }

  // For Internet Explorer
  & {
    scrollbar-face-color: $foreground-color;
    scrollbar-track-color: $background-color;
  }

  // For FireFox
  & {
    scrollbar-color: $foreground-color $background-color;
    @if $size < 10px {
      scrollbar-width: thin;
    } @else {
      scrollbar-width: auto;
    }
  }
}

$navbar-height: 41px;

.navigation-drawer {
  position: fixed;
  top: $navbar-height;
  right: 0;
  bottom: 0;
  width: 100vw;
  max-width: 414px;
  overflow-y: auto;
  display: none;
  flex-direction: column;
  justify-content: space-between;
  transition: transform .5s ease-out;
  transform: translateX(100%);
  background-color: var(--clr-base-d600);
  border-left: 1px solid var(--clr-base-d400);
  @include scrollbars(6px, #555, #666, #070f17, 3px, 0px);
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    li {
      margin-bottom: 0.5rem;
      a {
        display: inline-block;
        width: 100%;
        color: var(--clr-base-l250);
        background-color: var(--clr-base-d400);
        border-radius: 6px;
        border: 1px solid var(--clr-base-d300);
        &:hover, &.active:hover {
          background-color: var(--clr-base);
          border-color: var(--clr-base-l100);
          color: var(--clr-base-l500);
        }
        &:active {
          background-color: var(--clr-base);
          color: var(--clr-base-l500);
        }
        &.active, &.router-link-active {
          background-color: var(--clr-base-d200);
          border: 1px solid var(--clr-base-d100);
          color: var(--clr-base-l250-inv);
        }
      }
    }
  }
}
```

## CURL Codeblock

```curl
curl -X POST http://www.yourwebsite.com/login/ -d 'username=yourusername&password=yourpassword'
```

## D Codeblock

```d
uint factorial(in uint n) pure nothrow @nogc
in {
    assert(n <= 12);
} body {
    if (n == 0)
        return 1;
    else
        return n * factorial(n - 1);
}
 
// Computed and printed at compile-time.
pragma(msg, 12.factorial);
 
void main() {
    import std.stdio;
 
    // Computed and printed at run-time.
    12.factorial.writeln;
}
```

## Dart Codeblock

```dart
int fact(int n) {
  if(n<0) {
    throw new IllegalArgumentException('Argument less than 0');
  }
  return n==0 ? 1 : n*fact(n-1);
}
 
main() {
  print(fact(10));
  print(fact(-1));
}
```

## Diff Codeblock

```diff
quickstatements:
-- image: wikibase/quickstatements:latest
++ build: ./quickstatements/latest
```

## Docker Codeblock

```dockerfile
FROM ubuntu:20.04

ENV APACHE_RUN_USER     www-data
ENV APACHE_RUN_GROUP    www-data
ENV APACHE_LOG_DIR      /var/log/apache2
ENV APACHE_PID_FILE     /var/run/apache2.pid
ENV APACHE_RUN_DIR      /var/run/apache2
ENV APACHE_LOCK_DIR     /var/lock/apache2
ENV APACHE_LOG_DIR      /var/log/apache2

ENV CA_PROVIDENCE_VERSION=1.7.13
ENV CA_PROVIDENCE_DIR=/var/www/providence
ENV CA_PAWTUCKET_VERSION=1.7.13
ENV CA_PAWTUCKET_DIR=/var/www

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y apache2 \
	curl \
	wget \
	zip \
	php7.4 \
	php7.4-curl \
	php7.4-gd \
	php7.4-xml \
	php7.4-zip \
	php-mysql \
	php-ldap \
	libapache2-mod-php7.4 \
	mysql-client \
	ffmpeg \
	ghostscript \
	imagemagick \
	libreoffice

#GMAGICK
RUN apt-get install -y php-pear php7.4-dev graphicsmagick libgraphicsmagick1-dev \
	&& pecl install gmagick-2.0.4RC1

# https://github.com/collectiveaccess/providence/archive/refs/tags/$CA_PROVIDENCE_VERSION.gz
RUN curl -SsL https://github.com/collectiveaccess/providence/archive/refs/tags/$CA_PROVIDENCE_VERSION.tar.gz | tar -C /var/www/ -xzf -
RUN mv /var/www/providence-$CA_PROVIDENCE_VERSION /var/www/providence
RUN cd $CA_PROVIDENCE_DIR && cp setup.php-dist setup.php

RUN curl -SsL https://github.com/collectiveaccess/pawtucket2/archive/refs/tags/$CA_PAWTUCKET_VERSION.tar.gz | tar -C /var/www/ -xzf -
RUN mv $CA_PAWTUCKET_DIR/pawtucket2-$CA_PAWTUCKET_VERSION/* /var/www
RUN cd $CA_PAWTUCKET_DIR && cp setup.php-dist setup.php

RUN sed -i "s@DocumentRoot \/var\/www\/html@DocumentRoot \/var\/www@g" /etc/apache2/sites-available/000-default.conf
RUN rm -rf /var/www/html
RUN ln -s /$CA_PROVIDENCE_DIR/media /$CA_PAWTUCKET_DIR/media

RUN chown -R www-data:www-data /var/www

# Create a backup of the default conf files in case directory is mounted
RUN mkdir -p /var/ca/providence/conf
RUN cp -r /$CA_PROVIDENCE_DIR/app/conf/* /var/ca/providence/conf

# Copy our local files
COPY php.ini /etc/php/7.4/apache2/php.ini
COPY entrypoint.sh /entrypoint.sh
RUN chmod 777 /entrypoint.sh

# Run apcache from entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
CMD [ "/usr/sbin/apache2", "-DFOREGROUND" ]
```


## Erlang Codeblock

```erlang
fac(N) -> fac(N-1,N).
fac(1,N) -> N;
fac(I,N) -> fac(I-1,N*I).
```

## Go Codeblock

```go
package main
 
import (
    "math/big"
    "fmt"
)
 
func factorial(n int64) *big.Int {
    var z big.Int
    return z.MulRange(1, n)
}
 
func main() {
    fmt.Println(factorial(800))
}
```

## Groovy Codeblock

```groovy
def rFact
rFact = { (it > 1) ? it * rFact(it - 1) : 1 as BigInteger }
```

## Handlebars Codeblock

```handlebars
{{firstname}} {{lastname}}
```

## HTML 

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Provident, quis?</h1>
</body>
</html>
```

## XML 

```xml
<?xml version="1.0" encoding="UTF-8"?>
<OAI-PMH xmlns="http://www.openarchives.org/OAI/2.0/"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
  xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/http://www.openarchives.org/OAI/2.0/OAI-PMH.xsd">
  <responseDate>2021-10-31T11:06:57Z</responseDate>
  <request verb="GetRecord">https://foo.bar/oai-pmh/entities</request>
  <GetRecord>
    <record>
      <header>
        <identifier>0f37a29b-e6c7-4782-872c-ee78bedb2b4b</identifier>
        <datestamp>2021-10-29T15:26:17Z</datestamp>
      </header>
      <metadata>
        <kor:entity xmlns:kor="https://coneda.net/XMLSchema/1.1/"
          xsi:schemaLocation="https://coneda.net/XMLSchema/1.1/https://conedakor-1.bua-dns.de/schema/1.1/kor.xsd">
          <kor:id>0f37a29b-e6c7-4782-872c-ee78bedb2b4b</kor:id>
          <kor:collection id="1">Default</kor:collection>
          <kor:created-at>2021-10-29T15:26:17Z</kor:created-at>
          <kor:updated-at>2021-10-29T15:26:17Z</kor:updated-at>
          <kor:type id="93a03d5c-e439-4294-a8d4-d4921c4d0dbc">medium</kor:type>
          <kor:image-path style="original">https://foo.bar/001/image.jpg?1635521177</kor:image-path>
          <kor:image-path style="screen" dimensions="1440x1440">https://foo.bar/001/image.jpg?1635521177</kor:image-path>
          <kor:image-path style="normal" dimensions="800x800">https://foo.bar/001/image.jpg?1635521177</kor:image-path>
          <kor:image-path style="preview" dimensions="300x300">https://foo.bar/preview/000/000/001/image.jpg?1635521177</kor:image-path>
          <kor:image-path style="thumbnail" dimensions="140x140">https://foo.bar/thumbnail/000/000/001/image.jpg?1635521177</kor:image-path>
          <kor:image-path style="icon" dimensions="80x80">https://foo.bar/icon/000/000/001/image.jpg?1635521177</kor:image-path>
          <kor:tags></kor:tags>
          <kor:fields></kor:fields>
          <kor:properties></kor:properties>
          <kor:datings></kor:datings>
          <kor:comment></kor:comment>
        </kor:entity>
      </metadata>
    </record>
  </GetRecord>
</OAI-PMH>
```

## INI Codeblock

```ini
# Automatically generated for Debian scripts. DO NOT TOUCH!
[client]
host     = localhost
user     = root
password = <YOUR MYSQL ROOT PASSWORD>
socket   = /var/run/mysqld/mysqld.sock
[mysql_upgrade]
host     = localhost
user     = root
password = <YOUR MYSQL ROOT PASSWORD>
socket   = /var/run/mysqld/mysqld.sock
basedir  = /usr
```

## Java Codeblock

```java
package programas;
 
import java.math.BigInteger;
import java.util.InputMismatchException;
import java.util.Scanner;
 
public class RecursiveFactorial {
 
  public BigInteger factorial(BigInteger n) {
    if ( n == null ) {
      throw new IllegalArgumentException();
    }
 
    else if ( n.equals(BigInteger.ZERO) ) {
      return BigInteger.ONE;
    }
    else if ( n.signum() == - 1 ) {
      // negative
      throw new IllegalArgumentException("Argument must be a non-negative integer");
    }
    else {
      return n.equals(BigInteger.ONE)
          ? BigInteger.ONE
          : factorial(n.subtract(BigInteger.ONE)).multiply(n);
    }
  }
 
  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    BigInteger number, result;
    boolean error = false;
    System.out.println("FACTORIAL OF A NUMBER");
    do {
      System.out.println("Enter a number:");
      try {
        number = scanner.nextBigInteger();
        result = new RecursiveFactorial().factorial(number);
        error = false;
        System.out.println("Factorial of " + number + ": " + result);
      }
      catch ( InputMismatchException e ) {
        error = true;
        scanner.nextLine();
      }
 
      catch ( IllegalArgumentException e ) {
        error = true;
        scanner.nextLine();
      }
    }
    while ( error );
    scanner.close();
 
  }
 
}
```

## Javascript Codeblock

```javascript
function fancyAlert(arg) {
  if(arg) {
    $.facebox({div:'#foo'})
  }
}
const foo => (bar) { bar?.buzz? bar.buzz : false }
var factorial = n => (n < 2) ? 1 : n * factorial(n - 1);
```
  
## JSON Codeblock

```json
{
  "firstName": "John",
  "lastName": "Smith",
  "age": 25,
  "categories": [
    {
      "id": 19,
      "category": "Venue",
      "comment": null,
      "pivot": {
        "address_id": 6213,
        "category_id": 19,
        "updated_by": 34,
        "created_by": 34,
        "created_at": "2004-03-10T15:18:27.000000Z",
        "updated_at": "2004-03-10T15:18:27.000000Z"
      }
    }
  ],
}
```

## JSX Codeblock

```jsx
const element = (
  <h1>
    Hello, {formatName(user)}!
  </h1>
);
```

## Julia Codeblock

```julia
function fact(n::Integer)
    n < 0 && return zero(n)
    f = one(n)
    for i in 2:n
        f *= i
    end
    return f
end
 
for i in 10:20
	println("$i -> ", fact(i))
end
```

## Kotlin Codeblock

```kotlin
fun facti(n: Int) = when {
    n < 0 -> throw IllegalArgumentException("negative numbers not allowed")
    else  -> {
        var ans = 1L
        for (i in 2..n) ans *= i
        ans
    }
}
 
fun factr(n: Int): Long = when {
    n < 0 -> throw IllegalArgumentException("negative numbers not allowed")
    n < 2 -> 1L
    else  -> n * factr(n - 1)
}
 
fun main(args: Array<String>) {
    val n = 20
    println("$n! = " + facti(n))
    println("$n! = " + factr(n))
}
```

## Liquid Codeblock

```liquid
{% assign beatles = "John, Paul, George, Ringo" | split: ", " %}

{{ beatles | join: " and " }}
```

## Markdown Codeblock

```markdown

# Self Referencing

- Loop Exceptions
- FooBar

```

## Objective-C Codeblock

```objc
-(int)factorialRecursive:(int)operand
{
    if( operand == 1 || operand == 0) {
        return(1);
    } else if( operand < 0 ) {
        return(-1);
    }

    return( operand * [self factorialRecursive:operand-1] );
}

-(int)factorialLoop:(int)operand
{

    if( operand == 1 || operand == 0) {
        return(1);
    } else if( operand < 0 ) {
        return(-1);
    }

    int factorial = 1;
    for(int i = operand; i > 1; i-- ) {
        factorial *= i;
    }

    return( factorial );

}
int factNumber = 10;
NSLog(@"%d! = %d",factNumber,[self factorialRecursive:factNumber]);
NSLog(@"%d! = %d",factNumber,[self factorialLoop:factNumber]);
```

## OCaml Codeblock

```ocaml
let factorial n =
  let rec loop i accum =
    if i > n then accum
    else loop (i + 1) (accum * i)
  in loop 1 1
```

## Perl Codeblock

```perl
use List::Util qw(reduce);
sub factorial
{
  my $n = shift;
  reduce { $a * $b } 1, 1 .. $n
}
```

## Powershell Codeblock

```powershell
function Get-Factorial ($x) {
    if ($x -eq 0) {
        return 1
    }
    return $x * (Get-Factorial ($x - 1))
}
```

## PHP Codeblock

```php
declare(strict_types=1);
/*
 * This file is part of the Gws package.
 *
 * (c) Grandgeorg Websolutions, Viktor Grandgeorg <viktor@grandgeorg.de>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Gws;

use Gws\System\DIC;
use Gws\Image\Compressor;
use Gws\System\Msg;
use Monolog\Handler\StreamHandler;
use Monolog\Logger;
use Noodlehaus\Config;

/**
 * Application
 * Main Controller Class
 *
 * @author Viktor Grandgeorg <viktor@grandgeorg.de>
 */
final class App
{
    use Msg;

    protected $options = array();

    public function __construct()
    {
        $this->sysconf = $this->getSystemConfig();
        $this->setErrorReporting();
        $this->logger = $this->getLogger();
    }

    /**
     * Get system configuration
     *
     * @return Config
     */
    protected function getSystemConfig(): Config
    {
        return DIC::add(Config::class . '\System', function(...$p) {
            return new Config(...$p);
        }, [__DIR__ . '/../config/sysconfig.php']);
    }

    public static function factorial($n) {
        if ($n < 0) {
            return 0;
        }
        
        if ($n == 0) {
            return 1;
        }
        
        else {
            return $n * App::factorial($n-1);
        }
    }
}
```

## Python Codeblock

```python
from itertools import (accumulate, chain)
from operator import mul
 
 
# factorials :: [Integer]
def factorials(n):
    return list(
        accumulate(chain([1], range(1, 1 + n)), mul)
    )
 
print(factorials(5))
 
# -> [1, 1, 2, 6, 24, 120]
```

## R Codeblock

```r
fact <- function(n) {
  if (n <= 1) 1
  else n * Recall(n - 1)
}
```

## Ruby Codeblock

```ruby
# Tail-recursive
def factorial_tail_recursive(n, prod = 1)
  n.zero? ? prod : factorial_tail_recursive(n - 1, prod * n)
end
 
require 'benchmark'
 
n = 400
m = 10000
 
Benchmark.bm(16) do |b|
  b.report('tail recursive:')  {m.times {factorial_tail_recursive(n)}}
end
```

## Rust Codeblock

```rust
fn factorial_recursive (n: u64) -> u64 {
    match n {
        0 => 1,
        _ => n * factorial_recursive(n-1)
    }
}
 
fn factorial_iterative(n: u64) -> u64 {
    (1..=n).product()
}
 
fn main () {
    for i in 1..10 {
        println!("{}", factorial_recursive(i))
    }
    for i in 1..10 {
        println!("{}", factorial_iterative(i))
    }
}
```

## Scala Codeblock

```scala
def factorial(n: Int) = {
  @tailrec def fact(x: Int, acc: Int): Int = {
    if (x < 2) acc else fact(x - 1, acc * x)
  }
  fact(n, 1)
}
```

## Shell Codeblock

```sh
apt update && apt upgrade
apt --assume-yes install curl vim mc htop imagemagick git nodejs npm webp
cp /usr/lib/foo /var/www/buz

function factorial {
  typeset n=$1 f=1 i
  for ((i=2; i < n; i++)); do
    (( f *= i ))
  done
  echo $f
}
```

## SQL Codeblock

```sql
SELECT `user` AS `usr`, `host`, `password`, `plugin` FROM mysql.user;
UPDATE mysql.user SET plugin='' WHERE user='root';
FLUSH PRIVILEGES;
```

## Swift Codeblock

```swift
func factorial(_ n: Int) -> Int {
	return n < 2 ? 1 : n * factorial(n - 1)
}
```

## TypeScript Codeblock

```ts
import {
  Ref,
  UnwrapRef,
  ComputedRef,
  WritableComputedOptions,
  DebuggerOptions,
  WritableComputedRef
} from '@vue/runtime-dom'

declare const RefType: unique symbol

declare const enum RefTypes {
  Ref = 1,
  ComputedRef = 2,
  WritableComputedRef = 3
}

type RefValue<T> = T extends null | undefined
  ? T
  : T & { [RefType]?: RefTypes.Ref }

type ComputedRefValue<T> = T extends null | undefined
  ? T
  : T & { [RefType]?: RefTypes.ComputedRef }

type WritableComputedRefValue<T> = T extends null | undefined
  ? T
  : T & { [RefType]?: RefTypes.WritableComputedRef }

type NormalObject<T extends object> = T & { [RefType]?: never }

/**
 * Vue ref transform macro for binding refs as reactive variables.
 */
declare function _$<T>(arg: ComputedRef<T>): ComputedRefValue<T>
declare function _$<T>(arg: WritableComputedRef<T>): WritableComputedRefValue<T>
declare function _$<T>(arg: Ref<T>): RefValue<T>
declare function _$<T extends object>(arg?: T): DestructureRefs<T>

type DestructureRefs<T extends object> = {
  [K in keyof T]: T[K] extends ComputedRef<infer V>
    ? ComputedRefValue<V>
    : T[K] extends WritableComputedRef<infer V>
    ? WritableComputedRefValue<V>
    : T[K] extends Ref<infer V>
    ? RefValue<V>
    : T[K]
}
```

## YAML Codeblock

```yaml
version: '3.8'

services:
  server:
    image: gitea/gitea:1.15.6
    restart: always
    container_name: gitea
    environment:
      USER_UID: "${USER_UID}"
      USER_GID: "${USER_GID}"
      GITEA__database__DB_TYPE: mysql
      GITEA__database__HOST: db:3306
      GITEA__database__NAME: "${MYSQL_DATABASE}"
      GITEA__database__USER: "${MYSQL_USER}"
      GITEA__database__PASSWD: "${MYSQL_PASSWORD}"
    networks:
      - gitea
    volumes:
      - ./gitea:/data
      - /etc/timezone:/etc/timezone:ro
      - /etc/localtime:/etc/localtime:ro
      - /home/git/.ssh/:/data/git/.ssh
    ports:
      - "3000:3000"
      - "127.0.0.1:2222:22"
    depends_on:
      - db
  db:
    image: "mariadb:${MARIADB_VERSION}"
    restart: always
    cap_add:
      - SYS_NICE
    networks:
      - gitea
    volumes:
      - "./mysql:${MARIADB_DATA_DIR}"
    environment:
      MYSQL_ROOT_PASSWORD: "${MYSQL_ROOT_PASSWORD}"
      MYSQL_USER: "${MYSQL_USER}"
      MYSQL_PASSWORD: "${MYSQL_PASSWORD}"
      MYSQL_DATABASE: "${MYSQL_DATABASE}"
networks:
  gitea:
    external: false
```


## SSL Certificate with Let's encrypt

This is just a sample chapter ...

- **[Certbot documentation](https://certbot.eff.org/docs/)**

[Link back to cusom id](#custom-id)

### Foo Bar

**`certbot renew` command wil not work with this!**


[^1]: This is the first footnote.

[^bignote]: Here's one with multiple paragraphs and code.

    Indent paragraphs to include them in the footnote.

    `{ my code }`

    Add as many paragraphs as you like.