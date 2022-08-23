import React from 'react'
import { useHistory } from "react-router";
import '../stylesheet/common.css'


export default function HomePage({user}) {
    const history = useHistory();
    // const goto=()=>{
    //     history.push({
    //         pathname: "/view",
    //       });
    // }
    const login=()=>{
        history.push({
            pathname: "/login",
          });
    }
    return (
        
        <div>
    <section id="header">
        <div class="container">
        {/* <button className="btn right goto-button" onClick={goto}><span>Go to</span></button> */}
        <div class="box-2">
        <button class="goto-btn btn-button btn-two" onClick={login}>
            <span>Login</span>
        </button>
        </div>
            <div class="row text-center">
                <div class="col-md-8">
                    {/* <img class="logo" src="images/logo.png" /> */}
                    <h1 class="white-text">Welcome To CB-INTRADE</h1>
                    <h5 class="white-text">
                        This portal has been designed for Company’s Policy for
                        Prevention of Insider Trading, pursuant to SEBI (Prohibition of
                        Insider Trading) Regulations, 2015
                    </h5>
                    <div id="countdown" class="white-text"></div>
                </div>
            </div>
        </div>
        <div class="animation">
        <a class="arrow-down-animation" data-scroll href="#about"><i class="fa fa-angle-down"></i></a>
        </div>
    </section>

    {/* <section id="about">
        <div class="container">
            <div class="row text-center">
                
                <div data-sr="enter top over 1s, wait 0.3s, move 24px, reset" class="col-md-4">
                    <i class="fa fa-laptop"></i>
                    <h3>Responsive Design</h3>
                    <div class="colored-line-small-center"></div>
                    <p>Lorem ipsum dolor sit amet, ed do eiusmod tempor incididunt ut labore et dolore magna.</p>
                </div>
                
                <div data-sr="enter bottom over 1s, wait 0.3s, move 24px, reset" class="col-md-4 middle">
                    <i class="fa fa-lightbulb-o"></i>
                    <h3>Creative Design</h3>
                    <div class="colored-line-small-center"></div>						
                    <p>Lorem ipsum dolor sit amet, ed do eiusmod tempor incididunt ut labore et dolore magna.</p>						
                </div>
                
                <div data-sr="enter top over 1s, wait 0.3s, move 24px, reset" class="col-md-4">
                    <i class="fa fa-newspaper-o"></i>
                    <h3>Mailchimp Ready</h3>
                    <div class="colored-line-small-center"></div>
                    <p>Lorem ipsum dolor sit amet, ed do eiusmod tempor incididunt ut labore et dolore magna.</p>						
                </div>
            </div>
        </div>			
    </section>


    <section id="subscribe">
        <div class="container">
            <i data-sr="ease-in over 1s, reset" class="fa fa-envelope icontop"></i>
            <div class="row text-center">
                <div class="col-md-8 col-md-offset-2">
                     <h2 data-sr="enter top over 1s, wait 0.3s, move 24px, reset" class="white-text">Sign up to our Newsletter</h2>
                    <h5 data-sr="enter bottom over 1s, wait 0.3s, move 24px, reset" class="white-text">Stay up2date with climb-up</h5>
                    
                    <form id="mc_form" role="form">
                        <input data-sr="enter top over 1s, wait 0.3s, move 24px, reset" type="email" class="form-control" id="mc-email" name="mc-email" placeholder="Your Email" />
                        <button data-sr="enter bottom over 1s, wait 0.3s, move 24px, reset" type="submit" class="button-leweb">Submit</button>
                        <label for="mc-email" class="mc-email"></label>
                    </form> 
                    
                </div>
            </div>
        </div>	
    </section>

 */}

    <section id="contact">
        <div class="container">
            <div class="row text-center">
                <div class="col-md-8 col-md-offset-2">
                <h3>C B Management Services(P) Limited</h3>
                <p>
                    P-22, Bondel Rd, Ballygunge Park, Ballygunge, Kolkata, West Bengal
                  <br />
                  Pin: 700019 <br />
                  <br />
                  <strong>Phone:</strong> 033 4011 6700
                  <br />
                  <strong>Fax:</strong> 033 4011 6739
                  <br />
                  <strong>Email:</strong> rta@cbmsl.com
                  <br />
                </p>					
                </div>				
            </div>
        </div>
    </section>

    <footer id="footer">
        <div class="container">
            <div class="row text-center">	
                <p>
                    &copy; Design & Developed by<a href="http://templatestock.co">CBMSL</a>.All Rights Reserved
                    <span class="social">
                        <a href="#"><i class="fa fa-facebook-square"></i></a>
                        <a href="#"><i class="fa fa-twitter-square"></i></a> 
                        <a href="#"><i class="fa fa-google-plus-square"></i></a>
                    </span>
                </p>
            </div>
        </div>		
    </footer>
        </div>
    )
}

