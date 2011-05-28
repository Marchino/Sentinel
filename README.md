Sentinel
========
Smart javascript form validator
-------------------------------
Sentinel is a simple jQuery plugin which aims to simplify client side validations on any kind of form.
Sentinel comes bundled with a couple of common validators and two callbacks (one for success and one for failure), but lets you add and use your own.
Example
------------------
Let's say you have a simple form with 2 input fields in which your server side script expects to find an email and a confirmation of it.
Sentinel would validate that form like this: 

    $('form').sentinel()
      .check('#email')
        .for('email')
          .error_message('Wrong email format')
        .for('presence')
          .error_message('Mandatory field')      
      .check('#email_confirmation')
        .for('confirmation')
          .error_message('Email confirmation should be equal to email')
      .start()

Feedback
--------
I'm very interested in any kind of feedback and ideas: please, submit them to marco.crepaldi@gmail.com or on my twitter (@_marchino_).
Thank you

