function sentMail(){
var fullname = document.getElementById("contactForm").elements.namedItem("fullnameid").value;
var email = document.getElementById("contactForm").elements.namedItem("emailid").value;
var body = document.getElementById("contactForm").elements.namedItem("commentid").value;

var subject = fullname + email;

window.location.href = "mailto:?subject="+subject+"&body="+body;
}