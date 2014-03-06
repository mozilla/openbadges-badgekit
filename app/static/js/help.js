
$(document).ready(function() {


  var faqItems = [
    {
      question : 'What is BadgeKit?',
      answer : '<p>BadgeKit is a set of open, foundational tools to make the badging process easy. It includes tools to support the entire process, including badge design, creation, assessment and issuing, remixable badge templates, milestone badges to support leveling up, and much more. The tools are open source and have common interfaces to make  it easy to build additional tools or customizations on top of the  standard core, or to plug in other tools or systems.</p><p>BadgeKit  builds on existing technologies that have evolved out of several years of work and user testing, including Chicago Summer of Learning. In fact, specific tools within BadgeKit are currently being used for key partners within the badges ecosystem (i.e.  <a href="http://badges.connectededucators.org/">Connected Educators</a>).</p><p>BadgeKit is now available in two forms: We have a hosted version of Mozilla BadgeKit available in private beta for select partner organizations that meet specific technical requirements. And anyone can download the code from GitHub and implement it on their own servers.</p><p>BadgeKit: <ul> <li>Improves the badging experience for issuers, learners and consumers, by making badging easy to do.</li> <li>Closes the current gaps in the ecosystem by providing free, open badging tools to support the needs of issuers. </li> <li>Provides foundational tools needed to help grow and develop the open badges ecosystem.</li> <li>Builds our values of openness, interoperability, agency, choice, and connectedness into the way we recognize learning and skills, and helps shape emerging badge systems.</li></p> '
    },
    {
      question : 'Why BadgeKit?',
      answer: '<p>While open badges technology has been gaining momentum -- with more than 2000  organizations issuing badges that align with the Open Badges system --- there are still ways we can make it easier for organizations to join the ecosystem.</p> <p>Today, there are too many gaps in the badging experience and many of the existing options are too closed, too expensive or too big. In fact, given the current options for organizations interested in issuing badges, it can be <span class="bold">harder to make an open badge than a closed badge!</span></p>'
    },
    {
      question : 'What tools does BadgeKit include?',
      answer: '<p>BadgeKit  provides modular and open options (standards) for the community of badge makers to use and build upon within their existing sites or systems. Currently, BadgeKit supports key points in the badging experience, including: <ul> <li>Design: A tool for defining all of the metadata, including criteria pages, and finalizing visual design for each badge.</li> <ul><li>Templates:  Visual and metadata designs that can be remixed by anyone creating a badge.</li> <li>Milestones: The ability to have a group of badges level up to a larger, more significant badge.</li></ul> <li>Assess:   A tool for mentor or peer assessment that includes issuer defining rubrics and criteria for a  badge, the ability for learners to apply for a  badge by adding information and evidence, as well as access for  assessors to manage applications and enable review and scoring.</li> <li>Issue: A tool for awarding badges to learners and hosting assertions to enable badges to be pushed to Backpacks.</li> <li>Collect:  A “Backpack” for collecting badges across various experiences or organizations.</li></ul></p><p>Throughout 2014, we will be adding additional tools to BadgeKit, including: <ul><li>Discover:  A directory of available badges with features for searching, filtering, wish listing and endorsing badges.</li><li>Share: A tool to enable easy sharing of badge on various sites across the web (i.e. Facebook, Twitter, Tumblr, etc.).</li><li>Collect: Backpacks will become “federated", meaning that different instances still plug into the broader ecosystem and can share data across.</li></ul></p>'
    },
    {
      question : 'How can I use BadgeKit?',
      answer: '<p>We have a hosted version of Mozilla BadgeKit available in private beta for select partner organizations that meet specific technical requirements. And anyone can download the code from  GitHub and implement it on their own servers. </p><p>SOFTWARE AS A SERVICE: At BadgeKit.org, you\'ll be able to access a hosted version of the tools to build out badges, remix badge templates, create badge levels, issue badges, etc. APIs will make it easy to then pull the badges and end user  interfaces into your own website. All of the backend pieces are hosted, supported and updated by Mozilla, and you\'ll have complete control over the experience of your end users through your own sites.</p><p>DOWNLOAD: Easily download the <a href"https://github.com/mozilla/openbadges-badgekit">code</a>  and install the tools on your own server.</p>'
    },
    {
      question : 'What\'s the difference between downloading the code from GitHub and using the hosted version?',
      answer: '<p>In downloading the BadgeKit code, you will be in charge of the backend and hosting of BadgeKit, and will be able to customize and extend the tools as much as needed. For the fully hosted version of BadgeKit, all the backend pieces are hosted, supported and updated by  Mozilla, while you still have complete control over the experience of your end users on your own sites through our APIs.</p><p>The hosted version of Mozilla BadgeKit is available in private beta for select partner organizations that meet specific technical requirements.</p>'
    },
    {
      question : 'Is BadgeKit available now?',
      answer: '<p>Yes! The hosted version of Mozilla BadgeKit is available in private beta for select partner organizations that meet specific technical requirements. Visit www.badgekit.org to learn more and apply for private beta access.</p><p>And BadgeKit is currently available on Github, with additional features set to be added in the coming months. To download the tools, visit <a href="https://github.com/mozilla/openbadges-badgekit">Github</a></p>'
    },
    {
      question : 'How can I sign up for the hosted version of BadgeKit?',
      answer: '<p>The hosted version of Mozilla BadgeKit is available in private beta for select partner organizations that meet specific technical requirements. </p><p>To  apply for private beta access, visit www.badgekit.org. Given your organization meets the specific hosted version requirements, you will receive a follow-up email within 24-hrs with full details on how to get started. </p>'
    },
    {
      question: 'What are the technical requirements for the hosted version of BadgeKit?',
      answer: '<p>The technical requirements necessary for private beta access to the hosted version of BadgeKit are: <ul><li>You have a front end website or have resources to develop one</li><li>You have technical resources on staff to integrate the BadgeKit APIs into your experience</li><li>You intend to build or rollout a badge system for your community and organization in 2014</li></ul></p>'
    },
    {
      question: 'How are you selecting partners for the hosted version?',
      answer: '<p>Right now we\'re making that decision based on each organization\'s technical resources and capacity. But by the end of 2014, the hosted version will be available to any organization looking to implement a badging system! </p>'
    },
    {
      question: 'Who is BadgeKit for?',
      answer: '<p>BadgeKit is currently in private beta and can be used by any issuing organization that meets specific technical requirements. It is aimed at organizations that  are building full badge systems and want to leverage their own sites and  systems on the front end, as well as have access to technology  resources. Tool providers might also be interested in leveraging BadgeKit to extend their own tools, or build additional customizations on top of BadgeKit.</p>'
    },
    {
      question: 'I am a Middle School teacher looking to issue badges. Can I use BadgeKit?',
      answer: '<p>Not yet. Today, BadgeKit is currently in private beta and meant for organizations that have access to technology resources and are looking to implement a full badge system. We are exploring ways to create a lighter weight version of BadgeKit that could be used by individuals, and hope to have it ready later this year. In the meantime check out the additional community driven issuing platforms at <a href"http://bit.ly/platform-chart">http://bit.ly/platform-chart</a> to help you get started.</p>'
    },
    {
      question: 'I want to issue a badge to a large group of people at one time. Is that possible?',
      answer: '<p>Not yet - but we\'re working on it! We will be developing this feature shortly after the DML Conference. You can track progress in Github <a href="https://github.com/mozilla/openbadges-badgekit/issues/205">here</a>.</p>'
    },
    {
      question: 'I need help. Is there someone that can help me?',
      answer: '<p>We have a variety of ways we can help. You can simply select the option that best meets your needs: <ul><li>Post general questions in our <a href="http://bit.ly/OBIGeneral">Community Google Groups</a> and post specific technical questions in our <a href"http://bit.ly/OBIDev">Dev Google Group</a>. </li><li>Reach members of the Open Badges team directly on Mozilla IRC in the #badges room. Join our BadgeKit webinar trainings for a full walk-through of the tools. The schedule will be posted soon.</li><li>Email questions directly to badges@mozillafoundation.org and a member of the team will follow-up directly.</li></ul></p>'
    }
  ];


  var faqContainer = $('.faq-container');
  var faqTemplate = $('.faq-template');
  var faqs = [];

  $.each( faqItems, function(key,faq){

      var template = faqTemplate.clone();
      template.find('.help-question').html(faq.question);
      template.find('.help-answer').html(faq.answer);
      template.removeClass('faq-template');

      faqs.push(template);

  });

  faqContainer.append(faqs);



  var helpAnswers = $('.help-answer');
  helpAnswers.hide();


  var helpQuestions = $('.help-question');
  helpQuestions.on('click', function() {
    var helpQuestion = $(this);
    helpQuestion.siblings('.help-answer').fadeToggle();

    return false;
  });


});

