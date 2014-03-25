function sentMail(){
var fullname = document.getElementById("contactForm").elements.namedItem("fullnameid").value;
var email = document.getElementById("contactForm").elements.namedItem("emailid").value;
var body = document.getElementById("contactForm").elements.namedItem("commentid").value;

var subject = email + " from: " + fullname;

window.location.href = "mailto:?subject="+subject+"&body="+body;
}