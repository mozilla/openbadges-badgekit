
$(document).ready(function() {


  var faqItems = [
    {
      question : 'What is BadgeKit?',
      answer : '<p>BadgeKit  is a set of open, foundational tools to make the badging process easy  and simple. It includes tools to support the entire process, including  badge design, creation, assessment and issuing, remixable badge  templates, milestone badges to support leveling up, and much more. The  tools are open source and have common interfaces to make it easy to  build additional tools or customizations on top of the standard core,  or to plug in other tools or systems.</p> <p>BadgeKit  builds on existing technologies that have evolved out of several years  of work and user testing, including Chicago Summer of Learning. In fact, specific tools within BadgeKit are currently being used for key  partners within the badge ecosystem (i.e.  <a href="http://badges.connectededucators.org/">Connected Educators</a>).</p> '
    },
    {
      question : 'Why BadgeKit?',
      answer : '<p>Within today\'s badge ecosystem, there are too many gaps in the badging experience  and many of the existing options are too closed, too expensive or too big. In fact, given the current options for organizations interested in issuing badges, it\'s harder to make an open badge than a closed badge!</p> <p>Our goal with BadgeKit is to: <ul> <li>Improve the badging experience for issuers, learners and consumers, making badging simple and easy to do.</li> <li>Close the badging experience gaps by providing free, open badging tools to support the needs of issuers. </li> <li>Provide the foundational tools to stoke the growth and development of the open badges ecosystem.</li> <li>Build our values of openness, interoperability, agency, choice, and connectedness into the core and help shape emerging badge systems.</li> <li>BadgeKit  is open source so improvements made by community members can benefit  everyone, from bug fixes to new features and more. It is also easily extendable, working seamlessly with other open tools and systems as they emerge.</li> </ul> </p> '
    },
    {
      question : 'What tools does BadgeKit include?',
      answer : '<p>BadgeKit provides lightweight, modular and open options (standards) for the community of badge makers to use and build upon within their existing  sites or systems. For the March 2014 launch, BadgeKit will support key  points in the badging experience, including:</p><p><ul><li>Design: A tool for defining all of the metadata, including criteria pages, and finalizing visual design for each badge.</li> <li>Templates: Visual and metadata designs that can be remixed by anyone creating a badge.</li> <li>Milestones: The ability to have a group of badges level up to a larger, more significant badge.</li> <li>Assess: A tool for mentor or peer assessment that includes issuer defining  rubrics and criteria for a badge, the ability for learners to apply for a badge by adding information and evidence, as well as access for assessors to manage applications and enable review and scoring.</li> <li>Issue: A tool for awarding badges to learners and hosting assertions to enable badges to be pushed to Backpacks.</li> <li>Collect: A “Backpack” for collecting badges across various experiences or organizations.</li></ul></p> <p>In the coming months, we will be adding additional tools to BadgeKit as well, including: <ul><li>Discover: A directory of available badges with features for searching, filtering, wish listing and endorsing badges.</li> <li>Share: A tool to enable easy sharing of badge on various sites across the web (i.e. Facebook, Twitter, Tumblr, etc.).</li> <li>Collect: Backpacks will become “federated’, meaning that different instances  still plug into the broader ecosystem and can share data across.</li> </ul> </p> '
    },
    {
      question : 'How is BadgeKit Delivered?',
      answer : '<p>BadgeKit can be accessed and used in 2 main ways:</p> <p><ol> <li>DOWNLOAD: Download our <a href="https://github.com/mozilla/openbadges-badgekit">project on Github</a> and install the tools on your own server. You can easily download the  code for one or more of the tools and install on your own servers. This enables you to customize and extend the tools as much as needed. </li> <li>SOFTWARE AS A SERVICE: At <a href="http://BadgeKit.org">BadgeKit.org</a>, you can access hosted versions  of the tools to build out badges, remix badge templates, create badge levels, issue badges, etc. APIs make it easy to then pull the badges and end user interfaces into your own website. All of the backend pieces are hosted, supported and updated by Mozilla and you have complete control over the experience of your end users through your own sites.</li> </ul></p> '
    },
    {
      question : 'What\'s the difference between grabbing the code and signing up for the hosted version?',
      answer : '<p>In  downloading the BadgeKit code, you will be in charge of the backend and hosting of BadgeKit, and will be able to customize and extend the tools as much as needed. For the fully hosted version of BadgeKit, all the backend pieces are hosted, supported and updated by Mozilla while you still have complete control over the experience of your end users on your own sites through our APIs.</p> '
    },
    {
      question : 'Who is BadgeKit for?',
      answer : '<p>BadgeKit can be used by any issuing organization that is looking to build out  and offer badges to their end users. It is aimed at organizations that are building full badge systems and want to leverage their own sites and systems on the front end, as well as have access to technology  resources. Tool providers might also be interested in leveraging BadgeKit to extend their own tools, or build additional customizations on top of BadgeKit.</p> '
    },
    {
      question : 'When will BadgeKit be ready for implementation?',
      answer : '<p>BadgeKit is currently available for use, with additional features set to be added in the coming months. To download the tools, visit our <a href="https://github.com/mozilla/openbadges-badgekit">project on Github</a>. To sign up for the fully hosted service, visit <a href="http://badgekit.org">badgekit.org</a>. Given your organization meets the hosted version requirements, you will  receive a follow-up email within 24-hrs with full details on how to get  started. </p> '
    },
    {
      question : 'I am a middle school teacher looking to issue badges. Can I use BadgeKit?',
      answer : '<p>That\'s  great! We have numerous teachers working with Open Badges in their  classrooms. Today, BadgeKit is meant for organizations that have access  to technology resources and are looking to implement a full badge  system. We are exploring ways to create a lighter weight version of  BadgeKit that could be used by individuals in 2014, but in the meantime, we encourage you to check our chart of the additional <a href="http://bit.ly/platform-chart">community driven issuing platforms</a> to help you get started. </p> '
    },
    {
      question : 'I want to issue a badge to a large group of people at one time. Is that possible?',
      answer : '<p>Not  yet -- but we\'re working on it! We will be developing this feature  shortly after the DML Conference. You can track progress in Github in <a href="https://github.com/mozilla/openbadges-badgekit/issues/205">issue #205</a>.</p> '
    },
    {
      question : 'What\'s the difference between a template and a draft?',
      answer : '<p>When you log into BadgeKit, you will see templates and draft badges. A template is a badge definition which you can use to create draft badges. A draft badge is a badge you plan on issuing but which is currently a work in progress. </p> <p><ul> <li>Templates recognize the fact that some of your badges will include the same details. Draft badges recognize the fact that creating a badge can take time and effort.</li> <li>When you create a new draft badge, you can use a template to speed the process up. Templates give you a way to store badge ingredients, so that you can potentially use them in multiple badges. This lets you populate new badges with some details straight away, rather than having to specify the same details over again every time you create a new badge.</li> </ul></p> '
    },
    {
      question : 'Why does a badge need more than one description?',
      answer : '<p>When you work on a draft badge or template in BadgeKit, you will notice that the Description section requires more than one excerpt of description text. These are not required by the Open Badges Specification and but their inclusion was informed by experiences within real-world badging systems. For this reason you may find your badges more effective if you add these descriptions.</p> <p>The description fields are designed to address the fact that badges are viewed by people with different roles. Having more than one description field allows you to tailor the experience for this variety of people. For example, you may wish to use different language and to focus on different aspects of what a badge represents when describing it to an earner as opposed to a consumer (e.g. a potential employer).</p> '
    },
    {
      question : 'What can badge issuers do with BadgeKit?',
      answer : '<p>In BadgeKit, you can create badges, manage their status, review applications for them and issue them. The badge editing and creation tools give you full control over the appearance and data within a badge. </p> <p>You can also manage the lifecycle of a badge within BadgeKit, controlling when a badge is published and archiving it when you no longer want to issue it. Reviewers can assess badge applications within BadgeKit, making issuing decisions and providing feedback to the badge applicant. You can also manage badge claim codes within BadgeKit.</p> <p>The BadgeKit interface is designed to make badging processes as straightforward and convenient as possible.</p> '
    },
    {
      question : 'How will earners access the badges I create in BadgeKit?',
      answer : '<p>BadgeKit handles badge creation, review and issuing &ndash; client websites can display available badges by connecting to the BadgeKit APIs. See the API Introduction for a developer overview of how you can integrate BadgeKit with your own sites.</p> '
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
      answer : '<p>When you are editing a badge, you will see fields in the Options section for claim codes. Which options you choose will depend on the purpose of your badge. <ul> <li>Multi-use claim codes can be used by more than one earner to claim a badge, as opposed to a claim code that is specific to a single earner. </li> <li>If you make a badge unique, this means that an earner can only claim it once.</li> <li>For example, a badge awarded to many people for attending an event could reasonably use a multi-use claim code, whereas a badge designed to represent accreditation achieved by a particular individual might more sensibly use a unique claim code.</li> </ul></p>'
    },
    {
      question : 'What happens when an earner applies for a badge I created in BadgeKit?',
      answer : '<p>When an earner applies for a badge (submitting evidence if it is required), their application becomes available to review in BadgeKit. When a reviewer logs into BadgeKit, they can access pending badge applications using the Applications menu. Reviewers can assess evidence with relation to the badge criteria (and optionally a rubric), issuing to successful applicants, all from within BadgeKit.</p> <p>Notice that when you create a badge in BadgeKit, the Criteria section allows you to add a note for the reviewer &ndash; this will be displayed within BadgeKit when a reviewer assesses a pending badge application.</p> '
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
      answer : '<p>When you create a badge, the tags you enter in the Description section in BadgeKit can help earners to find badges to apply for. For example, a badge listing site can use tags to present groups or lists of badges on a particular topic that is of interest to the earner, letting them browse available badges using familiar website interaction.</p>'  
    }, 
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

