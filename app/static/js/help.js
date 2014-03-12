$(document).ready(function() {


  var faqItems = [
    {
      question : 'What is BadgeKit?',
      answer : '<p>BadgeKit is a set of open, foundational tools to make the badging process easy. It includes tools to support the entire process, including badge design, creation, assessment and issuing, remixable badge templates, milestone badges to support leveling up, and much more. The tools are open source and have common interfaces to make  it easy to build additional tools or customizations on top of the  standard core, or to plug in other tools or systems.</p><p>BadgeKit  builds on existing technologies that have evolved out of several years of work and user testing, including Chicago Summer of Learning. In fact, specific tools within BadgeKit are currently being used for key partners within the badges ecosystem (i.e.  <a href="http://badges.connectededucators.org/">Connected Educators</a>).</p><p>BadgeKit is now available in two forms: We have a hosted version of Mozilla BadgeKit available in private beta for select partner organizations that meet specific technical requirements. And anyone can download the code from GitHub and implement it on their own servers.</p><p>BadgeKit: <ul> <li>Improves the badging experience for issuers, learners and consumers, by making badging easy to do.</li> <li>Closes the current gaps in the ecosystem by providing free, open badging tools to support the needs of issuers. </li> <li>Provides foundational tools needed to help grow and develop the open badges ecosystem.</li> <li>Builds our values of openness, interoperability, agency, choice, and connectedness into the way we recognize learning and skills, and helps shape emerging badge systems.</li></ul></p> '
    },
    {
      question : 'Why BadgeKit?',
      answer: '<p>While open badges technology has been gaining momentum - with more than 2000 organizations issuing badges that align with the Open Badges system - there are still ways we can make it easier for organizations to join the ecosystem.</p> <p>Today, there are too many gaps in the badging experience and many of the existing options are too closed, too expensive or too big. In fact, given the current options for organizations interested in issuing badges, it can be <span class="bold">harder to make an open badge than a closed badge!</span></p>'
    },
    {
      question : 'What tools does BadgeKit include?',
      answer: '<p>BadgeKit  provides modular and open options (standards) for the community of badge makers to use and build upon within their existing sites or systems. Currently, BadgeKit supports key points in the badging experience, including: <ul> <li>Design: A tool for defining all of the metadata, including criteria pages, and finalizing visual design for each badge. <ul><li>Templates:  Visual and metadata designs that can be remixed by anyone creating a badge.</li> <li>Milestones: The ability to have a group of badges level up to a larger, more significant badge.</li></ul></li> <li>Assess: A tool for mentor or peer assessment that includes issuer defining rubrics and criteria for a  badge, the ability for learners to apply for a  badge by adding information and evidence, as well as access for  assessors to manage applications and enable review and scoring.</li> <li>Issue: A tool for awarding badges to learners and hosting assertions to enable badges to be pushed to Backpacks.</li> <li>Collect:  A "Backpack" for collecting badges across various experiences or organizations.</li></ul></p><p>Throughout 2014, we will be adding additional tools to BadgeKit, including: <ul><li>Discover:  A directory of available badges with features for searching, filtering, wish listing and endorsing badges.</li><li>Share: A tool to enable easy sharing of badge on various sites across the web (i.e. Facebook, Twitter, Tumblr, etc.).</li><li>Collect: Backpacks will become “federated", meaning that different instances still plug into the broader ecosystem and can share data across.</li></ul></p>'
    },
    {
      question : 'How can I use BadgeKit?',
      answer: '<p>We have a hosted version of Mozilla BadgeKit available in private beta for select partner organizations that meet specific technical requirements. And anyone can download the code from  GitHub and implement it on their own servers. </p><p><span class="bold">Software As A Service</span>: At <a href="https://badgekit.org/">BadgeKit.org</a>, you\'ll be able to access a hosted version of the tools to build out badges, remix badge templates, create badge levels, issue badges, etc. APIs will make it easy to then pull the badges and end user interfaces into your own website. All of the backend pieces are hosted, supported and updated by Mozilla, and you\'ll have complete control over the experience of your end users through your own sites.</p><p><span class="bold">Download</span>: Easily download the <a href="https://github.com/mozilla/openbadges-badgekit">code</a>  and install the tools on your own server.</p>'
    },
    {
      question : 'What\'s the difference between downloading the code from GitHub and using the hosted version?',
      answer: '<p>In downloading the BadgeKit code, you will be in charge of the backend and hosting of BadgeKit, and will be able to customize and extend the tools as much as needed. For the fully hosted version of BadgeKit, all the backend pieces are hosted, supported and updated by  Mozilla, while you still have complete control over the experience of your end users on your own sites through our APIs.</p><p>The hosted version of Mozilla BadgeKit is available in private beta for select partner organizations that meet specific technical requirements.</p>'
    },
    {
      question : 'Is BadgeKit available now?',
      answer: '<p>Yes! The hosted version of Mozilla BadgeKit is available in private beta for select partner organizations that meet specific technical requirements. Visit <a href="https://badgekit.org/">BadgeKit.org</a> to learn more and apply for private beta access.</p><p>And BadgeKit is currently available on Github, with additional features set to be added in the coming months. To download the tools, visit <a href="https://github.com/mozilla/openbadges-badgekit">Github</a></p>'
    },
    {
      question : 'How can I sign up for the hosted version of BadgeKit?',
      answer: '<p>The hosted version of Mozilla BadgeKit is available in private beta for select partner organizations that meet specific technical requirements. </p><p>To  apply for private beta access, visit <a href="https://badgekit.org/">BadgeKit.org</a>. Given your organization meets the specific hosted version requirements, you will receive a follow-up email within 24-hrs with full details on how to get started. </p>'
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
      answer: '<p>Not yet. Today, BadgeKit is currently in private beta and meant for organizations that have access to technology resources and are looking to implement a full badge system. We are exploring ways to create a lighter weight version of BadgeKit that could be used by individuals, and hope to have it ready later this year. In the meantime check out the additional community driven issuing platforms at <a href="http://bit.ly/platform-chart">http://bit.ly/platform-chart</a> to help you get started.</p>'
    },
    {
      question: 'I want to issue a badge to a large group of people at one time. Is that possible?',
      answer: '<p>Not yet - but we\'re working on it! We will be developing this feature shortly after the DML Conference. You can track progress in Github <a href="https://github.com/mozilla/openbadges-badgekit/issues/205">here</a>.</p>'
    },
    {
      question : 'What\'s the difference between a template and a draft?',
      answer : '<p>When you log into BadgeKit, you will see templates and draft badges. A template is a badge definition which you can use to create draft badges. A draft badge is a badge you plan on issuing but which is currently a work in progress. </p> <p><ul> <li>Templates recognize the fact that some of your badges will include the same details. Draft badges recognize the fact that creating a badge can take time and effort.</li> <li>When you create a new draft badge, you can use a template to speed the process up. Templates give you a way to store badge ingredients, so that you can potentially use them in multiple badges. This lets you populate new badges with some details straight away, rather than having to specify the same details over again every time you create a new badge.</li> </ul></p> '
    },
    {
      question : 'Why does a badge need more than one description?',
      answer : '<p>When you work on a draft badge or template in BadgeKit, you will notice that the <span class="bold">Description</span> section requires more than one excerpt of description text. These are not required by the Open Badges Specification and but their inclusion was informed by experiences within real-world badging systems. For this reason you may find your badges more effective if you add these descriptions.</p> <p>The description fields are designed to address the fact that badges are viewed by people with different roles. Having more than one description field allows you to tailor the experience for this variety of people. For example, you may wish to use different language and to focus on different aspects of what a badge represents when describing it to an earner as opposed to a consumer (e.g. a potential employer).</p> '
    },
    {
      question : 'What can badge issuers do with BadgeKit?',
      answer : '<p>In BadgeKit, you can create badges, manage their status, review applications for them and issue them. The badge editing and creation tools give you full control over the appearance and data within a badge. </p> <p>You can also manage the lifecycle of a badge within BadgeKit, controlling when a badge is published and archiving it when you no longer want to issue it. Reviewers can assess badge applications within BadgeKit, making issuing decisions and providing feedback to the badge applicant. You can also manage badge claim codes within BadgeKit.</p> <p>The BadgeKit interface is designed to make badging processes as straightforward and convenient as possible.</p> '
    },
    {
      question : 'How will earners access the badges I create in BadgeKit?',
      answer : '<p>BadgeKit handles badge creation, review and issuing &ndash; client websites can display available badges by connecting to the BadgeKit APIs. See the <a href="https://github.com/mozilla/openbadges-badgekit/wiki/BadgeKit-API-Introduction">API Introduction</a> for a developer overview of how you can integrate BadgeKit with your own sites.</p> '
    },
    {
      question : 'What parts of the badging process does BadgeKit NOT handle?',
      answer : '<p>At the moment BadgeKit is primarily aimed at helping organizations to deliver badge issuing. However, the BadgeKit APIs also help you to implement the badging processes not handled within BadgeKit itself. These processes allow you to easily integrate badging within your own environment, in a way that meets the needs of your community. For example, you could provide a custom listing of available badges. See the API Introduction for a guide to building this type of functionality on top of BadgeKit.</p> '
    },
    {
      question : 'When would I archive a badge?',
      answer : '<p>When you browse your published badges in BadgeKit, you will see the option to archive them. You can archive a badge when you do not want it to be available to earn any more. <ul> <li>Archiving a badge does not mean that you lose all data related to it. In BadgeKit, you can still view stats for an archived badge and you can copy an archived badge into a new draft, if you want to re-use its content.</li> <li>Archiving a badge does not stop existing earners of the badge from sharing or displaying it. Earned badges are no less valuable once they are archived, they are simply not available for earning anymore.</li></ul></p> '
    },
    {
      question : 'Should I use multi-use or unique claim codes?',
      answer : '<p>When you are editing a badge, you will see fields in the <span class="bold">Options</span> section for claim codes. Which options you choose will depend on the purpose of your badge. <ul> <li>Multi-use claim codes can be used by more than one earner to claim a badge, as opposed to a claim code that is specific to a single earner. </li> <li>If you make a badge unique, this means that an earner can only claim it once.</li> <li>For example, a badge awarded to many people for attending an event could reasonably use a multi-use claim code, whereas a badge designed to represent accreditation achieved by a particular individual might more sensibly use a unique claim code.</li> </ul></p>'
    },
    {
      question : 'What happens when an earner applies for a badge I created in BadgeKit?',
      answer : '<p>When an earner applies for a badge (submitting evidence if it is required), their application becomes available to review in BadgeKit. When a reviewer logs into BadgeKit, they can access pending badge applications using the <span class="bold">Applications</span> menu. Reviewers can assess evidence with relation to the badge criteria (and optionally a rubric), issuing to successful applicants, all from within BadgeKit.</p> <p>Notice that when you create a badge in BadgeKit, the <span class="bold">Criteria</span> section allows you to add a note for the reviewer &ndash; this will be displayed within BadgeKit when a reviewer assesses a pending badge application.</p> '
    },
    {
      question : 'What is badge status?',
      answer : '<p>You will see badge status information in various places within BadgeKit. The status of a badge tells you where it is in the badging lifecycle. Badge status can be template, draft, published or archived. Published badges are considered active, while archived badges are considered inactive.</p> '
    },
    {
      question : 'Do I need to fill in all of the fields when I create a badge?',
      answer : '<p>Some of the fields you see in BadgeKit are required by the Open Badges Specification. The required fields are: <ul><li>Name</li><li>Description</li><li>Criteria</li><li>Issuer</li></ul>An image is also required.</p> '
    },
    {
      question : 'When would I set a limit on a badge?',
      answer : '<p>When you edit a badge in BadgeKit, you will see a Limit field. This allows you to set a limit on how many people can earn the badge. </p> <p>An example of where you might wish to set a limit could be where a badge is intended to recognize an achievement that only a certain percentage or number of learners can be eligible for.</p> '
    },
    {
      question : 'When would I give a badge an expiry date?',
      answer : '<p>When you work on a badge in BadgeKit, you will see a control to set an expiration date in the Options section. This would be applicable in cases where the skill or achievement that the badge represents has a natural expiry date. </p> <p><ul> <li>For example, if a skill requires continuous learning over time, it could make sense to give its badge validity for a fixed time, so that the earner would have to keep demonstrating the skill repeatedly as time passes. This is a common pattern in areas requiring continuous learning and development such as technology and professional skills. An example of this would be a badge representing a CPR certificate.</li> </ul></p> '
    },
    {
      question : 'How are the badge tags used?',
      answer : '<p>When you create a badge, the tags you enter in the <span class="bold">Description</span> section in BadgeKit can help earners to find badges to apply for. For example, a badge listing site can use tags to present groups or lists of badges on a particular topic that is of interest to the earner, letting them browse available badges using familiar website interaction.</p>'  
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

