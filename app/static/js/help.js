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
      answer: '<p>We have a hosted version of Mozilla BadgeKit available in private beta for select partner organizations that meet specific technical requirements. And anyone can download the code from  GitHub and implement it on their own servers. </p><p><span class="bold">Software As A Service</span>: At <a href="https://badgekit.org/">BadgeKit.org</a>, you\'ll be able to access a hosted version of the tools to build out badges, remix badge templates, create badge levels, issue badges, etc. APIs will make it easy to then pull the badges and end user interfaces into your own website. All of the backend pieces are hosted, supported and updated by Mozilla, and you\'ll have complete control over the experience of your end users through your own sites.</p><p><span class="bold">Download</span>: Download the <a href="https://github.com/mozilla/openbadges-badgekit">code</a> and install the tools on your own server. BadgeKit comprises a Web app and an API - see the <a href="https://github.com/mozilla/openbadges-badgekit/wiki/BadgeKit-Self-Hosting-Guide">Self-Hosting Guide</a> for step-by-step instructions to getting both elements set-up in your own environment.</p>'
    },
    {
      question : 'What\'s the difference between downloading the code from GitHub and using the hosted version?',
      answer: '<p>In downloading the BadgeKit code, you will be in charge of the backend and hosting of BadgeKit, and will be able to customize and extend the tools as much as needed. For the fully hosted version of BadgeKit, all the backend pieces are hosted, supported and updated by  Mozilla, while you still have complete control over the experience of your end users on your own sites through our APIs.</p><p>The hosted version of Mozilla BadgeKit is available in private beta for select partner organizations that meet specific technical requirements. However, even if you do not use the hosted version of BadgeKit, you will be able to keep your own BadgeKit instance continuously updated through GitHub.</p>'
    },
    {
      question : 'Is BadgeKit available now?',
      answer: '<p>Yes! The hosted version of Mozilla BadgeKit is available in private beta for select partner organizations that meet specific technical requirements. Visit <a href="https://badgekit.org/">BadgeKit.org</a> to learn more and apply for private beta access.</p><p>And BadgeKit is currently available on Github, with additional features set to be added in the coming months. To build your own instance of the BadgeKit tools, follow the <a href="https://github.com/mozilla/openbadges-badgekit/wiki/BadgeKit-Self-Hosting-Guide">Self-Hosting Guide.</a></p>'
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
      question: 'What is the difference between the BadgeKit app and the BadgeKit API?',
      answer: '<p>As you will see when you start using the BadgeKit repos on GitHub, BadgeKit is actually made up of two main components - a Web app and an API. The Web app you see at <a href="https://github.com/mozilla/openbadges-badgekit">openbadges-badgekit</a> is the exact same as the Mozilla-hosted application you can see at <a href="https://badgekit.org">BadgeKit.org</a>. This means that you can install the app and use it on your own server as you would if you were using the hosted version, as well as making any changes you like to the code.</p><p>Whether you use the hosted version or install your own version, you need to handle earner interaction within your own site, which is where the BadgeKit API comes in - you can see it at <a href="https://github.com/mozilla/badgekit-api">badgekit-api</a>. The BadgeKit app provides a user interface for badge issuing admin and to manage applications for published badges. You can then use the API to plug your own front-end sites for earners into the badge data you build and manage within the BadgeKit app.</p><p>In other words, BadgeKit handles the badge admin back-end, letting you focus on building a front-end interface to suit your own community of earners. Additionally, you can opt to use the BadgeKit API without using the BadgeKit app, if you want to use your own badge admin interface. <span class="bold">BadgeKit is designed to let issuers choose the right components for their own earners.</span></p><p>For a more detailed overview of the BadgeKit components, see the <a href="https://wiki.mozilla.org/Badges/badgekit">MozillaWiki</a>.</p>'
    },
    {
      question: 'My organization will be issuing a lot of badges - how can BadgeKit help organize this?',
      answer: '<p>BadgeKit offers three levels of admin you can choose to use. Each organization with a BadgeKit account (or self-hosted instance) must define at least one <span class="bold">System</span>. If you opt not to use any additional admin levels, all of your badges will simply fall under that one system. However, you can use <span class="bold">Issuers</span> and <span class="bold">Programs</span> as well. A <span class="bold">System</span> can contain multiple <span class="bold">Issuers</span> and an <span class="bold">Issuer</span> can contain multiple <span class="bold">Programs</span>. Each <span class="bold">Program</span> may issue multiple badges.</p><p>The <span class="bold">System</span> is the top-level organization, so this may be an education or city authority. The <span class="bold">Issuers</span> could be individual organizations within the <span class="bold">System</span>, for example libraries or schools. The <span class="bold">Programs</span> could be programs of events, for example a summer learning festival.</p><p>You can manage user accounts for BadgeKit within this organizational structure, so for example, you could define a user as having permissions to review badge applications within a particular <span class="bold">Program</span> - when the user logs in, they will be able to access applications for badges defined within that <span class="bold">Program</span>. You can also configure user permissions within this context, for example giving a user permission to draft, publish and review badges.</p><p>Users with a login providing access to more than one system can toggle between system contexts using the link at the top of the page, which indicates the system you are viewing at all times.</p>'
    },
    {
      question : 'What\'s the difference between a template and a draft?',
      answer : '<p>When you log into BadgeKit, you will see templates and draft badges. A template is a badge definition which you can use to create draft badges. A draft badge is a badge you plan on issuing but which is currently a work in progress. </p> <p><ul> <li>Templates recognize the fact that some of your badges will include the same details. Draft badges recognize the fact that creating a badge can take time and effort.</li> <li>When you create a new draft badge, you can use a template to speed the process up. Templates give you a way to store badge ingredients, so that you can potentially use them in multiple badges. This lets you populate new badges with some details straight away, rather than having to specify the same details over again every time you create a new badge.</li> </ul></p><p>You can share templates between systems in BadgeKit using the <span class="bold">Actions</span> tab when viewing a template. BadgeKit will list a URL you can either forward to a colleague or use yourself in a different system context. To import a shared template, choose <span class="bold">Import a template</span> in the templates directory and paste the URL to create a copy of the template.</p> '
    },
    {
      question : 'Why does a badge need more than one description?',
      answer : '<p>When you work on a draft badge or template in BadgeKit, you will notice that the <span class="bold">Description</span> section requires more than one excerpt of description text. These are not required by the Open Badges Specification and but their inclusion was informed by experiences within real-world badging systems. For this reason you may find your badges more effective if you add these descriptions.</p> <p>The description fields are designed to address the fact that badges are viewed by people with different roles. Having more than one description field allows you to tailor the experience for this variety of people. For example, you may wish to use different language and to focus on different aspects of what a badge represents when describing it to an earner as opposed to a consumer (e.g. a potential employer).</p> '
    },
    {
      question : 'What are claim codes?',
      answer : '<p>The badge issuing process can vary. For some badges, the earner applies, submitting evidence, then a reviewer assesses their application and issues them with the badge if they meet the criteria. For other badges the process is much simpler. For example, if you are awarded a badge for attending an event, the organizer of the event may provide you with a claim code. By entering the claim code (via the issuer site), you may be awarded the badge straight away. Claim codes are also suitable for cases where assessment does occur, but outside of BadgeKit.</p><p>For the issuer, claim codes can be either single-use or multi-use. A single-use claim code can be used only once, so the badge can only be issued to one earner per claim code. Multi-use claim codes can be used by multiple different earners to receive a badge and are naturally only useful in certain situations. Badge issuers can manage the claim codes for their badges in BadgeKit.</p> '
    },
    {
      question: 'I\'m not a designer - will the badges I create look terrible?',
      answer: '<p>No! Don\'t worry if your design skills are not your strongpoint - the BadgeKit visual designer makes it incredibly easy to design a badge that uses attractive colors and visual elements. Like all aspects of the badges you create in BadgeKit, you can revisit your design repeatedly and continue editing it until you\'re ready to publish. Alternatively, if you do have design skills on hand and want to use them in the badges you create, you can upload them into BadgeKit, rather than using the design tool.</p>'
    },
    {
      question : 'What can badge issuers do with BadgeKit?',
      answer : '<p>In the BadgeKit app, you can create badges, manage their status, review applications for them and issue them. The badge editing and creation tools give you full control over the appearance and data within a badge. </p> <p>You can also manage the lifecycle of a badge within BadgeKit, controlling when a badge is published and archiving it when you no longer want to issue it. Reviewers can assess badge applications within BadgeKit, making issuing decisions and providing feedback to the badge applicant. You can also manage badge claim codes within BadgeKit.</p> <p>The BadgeKit interface is designed to make badging processes as straightforward and convenient as possible. The BadgeKit API manages the data for badges you publish through the BadgeKit app, with endpoints to let your earner-facing sites connect with events such as badges being awarded.</p> '
    },
    {
      question : 'How will earners access the badges I create in BadgeKit?',
      answer : '<p>BadgeKit handles badge creation, review and issuing &ndash; client websites can display available badges by connecting to the BadgeKit APIs. See the <a href="https://github.com/mozilla/openbadges-badgekit/wiki/BadgeKit-API-Introduction">API Introduction</a> for a developer overview of how you can integrate BadgeKit with your own sites.</p><p>The following is a typical scenario: <ul><li>An issuer uses the BadgeKit app to create and publish a badge.</li><li>The issuer presents a listing of available badges on their earner site using the BadgeKit API.</li><li>An earner can apply for the badge through the issuer\'s own site, which can forward the application data to the BadgeKit API.</li><li>An issuer reviewer can then access the earner application details (possibly including evidence) in the BadgeKit app, where they can submit an issuing decision.</li><li>The issuer\'s earner-facing site can then detect the issuing event and communicate with the earner.</li></ul></p><p>Alternatively, you can issue badges directly to an earner by entering their email address into BadgeKit, or can allow earners to claim badges using claim codes.</p> '
    },
    {
      question : 'What parts of the badging process does BadgeKit NOT handle?',
      answer : '<p>In general BadgeKit handles the badging processes that do not involve direct interaction with the earner.</p><p>At the moment BadgeKit is primarily aimed at helping organizations to deliver badge issuing. However, the BadgeKit APIs also help you to implement the badging processes not handled within BadgeKit itself. These processes allow you to easily integrate badging within your own environment, in a way that meets the needs of your community. </p><p>The following represents a typical list of badging processes an issuer site would carry out in conjunction with BadgeKit and the API:<ul><li>Listing published badges with the ability for an earner to submit an application.</li><li>Forwarding earner applications to BadgeKit API (sometimes including evidence).</li><li>Receiving notification of badging events using a webhook, including reviews being submitted and badges being issued.</li><li>Communicating with earners following events notified through the webhook.</li></ul></p><p>BadgeKit will be joined by various other badging utilities throughout 2014, including tools for sharing and discovering badges.</p> '
    },
    {
      question : 'What are the different ways in which a badge can be issued?',
      answer : '<p>BadgeKit facilitates badge issuing using the following processes:<ul><li>issuing directly to an earner email address</li><li>allowing earners to claim a badge using a claim code</li><li>earner submitting an application which is then reviewed and approved in BadgeKit</li><li>milestone badges can be issued following completion of a set of other badges.</li></ul></p><p><span class="bold">Note that when a badge is issued via BadgeKit, no communication is automatically carried out with the earner. BadgeKit is designed to keep issuers in control over earner data, so communication with earners is implemented via the API. When an badge is issued using any of the above processes, BadgeKit API will send a notification to a webhook URL of your choice. At the webhook, you can then contact the earner.</span></p> '
    },
    {
      question : 'What happens when I choose the "issue by email" option?',
      answer : '<p>When you issue by email in BadgeKit, you enter the earner email address to award the badge. When this happens, BadgeKit creates a badge instance. Your webhook URL will receive a notification at this point including the details of the new badge instance. You can then contact the earner to carry out any follow-up tasks you require, for example offering to push the badge to a backpack.</p> '
    },
    {
      question : 'What is a milestone?',
      answer : '<p>Badges are granular in nature, so BadgeKit includes the ability for you to define milestone badges. A milestone badge is awarded when the earner successfully earns a series of other badges. This allows you to recognize higher level, cumulative achievements. With milestones in mind, you can also choose to design your badges to accumulate in a milestone.</p> '
    },
    {
      question : 'Who can access badges and applications in BadgeKit?',
      answer : '<p>The <span class="bold">Account Settings</span> section in BadgeKit allows you to manage user accounts for people you want to have access to BadgeKit. You can optionally use three levels of admin for your BadgeKit instance/ account: System, Issuer and Program.</p><p>To use BadgeKit, you need to define at least a System, which may simply be the name of your organization. You can organize all of your badges and applications within this one System if that is all you need. However, the additional admin levels of Issuer and Program allow you to organize your badging and configure user permissions.</p><p>For example, some reviewers in your badging system may only be able to create badges and review applications for a particular issuing organization (e.g. a school, library or other organization) or learning program (for example a festival or event). In the <span class="bold">Account Settings</span>, you can give users access to particular Issuer or Program badges.</p><p>You can also set specific permissions for each user you grant access to BadgeKit. When you add a user by entering their email in the <span class="bold">Account Settings</span> section for a System, Issuer or Program, you can toggle their permissions to draft badges, publish badges and review applications. When logged into BadgeKit, users can toggle between the systems their account grants them access to.</p> '
    },
    {
      question : 'How does application review work in BadgeKit?',
      answer : '<p>The <span class="bold">Applications</span> menu <span class="bold">Pending</span> option provides access to any pending applications for each badge. Reviewers can view the details of a badge application, including submitted earner evidence and the relevant data from the badge definition itself, such as notes, criteria and optionally a rubric.</p><p>The <span class="bold">Review</span> section in BadgeKit includes a number of tabs to facilitate application review. The Description section provides an overview of the badge in question. The Evidence section includes whatever the applicant submitted when they applied for the badge. The Criteria section lists all Criteria for the badge, including an indicator of whether or not each one is required in order to earn the badge. If the reviewer marks each required item in the Criteria section as being met, BadgeKit will interpret this as a successful application. The Finish section allows the reviewer to include detailed feedback to forward to the earner when the application review is submitted.</p> '
    },
    {
      question : 'What happens when I review a badge application in BadgeKit?',
      answer : '<p>When someone reviews a badge application in BadgeKit, the issuer site can receive notification of the review using a webhook URL. When an application review is submitted, the webhook is sent the details of the review, including earner info, feedback and approval status. Webhook URLs are configured within your BadgeKit API. At this point the issuer site can communicate with the earner, informing them of the application result.</p><p>Note that when an assessor submits an application review, indicating that the earner meets the requirements for the badge, this does not mean that the badge is issued to the earner straight away. The issuer can choose to contact the earner at this point, offering them the badge if the application was successful. The issuer can then use the API endpoints to award the badge if the earner decides to accept it.</p><p>BadgeKit has been designed in this way so that issuers retain control over communication with their own community of earners, and over the earner data.</p> '
    },
    {
      question : 'What is the difference between a badge and a badge instance?',
      answer : '<p>BadgeKit models awarded badges as badge instances. This distinguishes an instance of a badge awarded to a specific earner from the generic data for a badge. When a badge application is reviewed and the earner is awarded it, a badge instance is created for that particular badge award. In the technical implementation of Open Badges, an awarded badge is represented using an <span class="bold">assertion</span>.</p><p>When a badge is issued, BadgeKit API sends notification to the issuer webhook including the details of the new instance.</p> '
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
      answer : '<p>When an earner applies for a badge (submitting evidence if it is required) through an issuer site that is integrated with the BadgeKit API, the badge application becomes available to review in BadgeKit.</p><p>When a reviewer logs into BadgeKit, they can access pending badge applications using the <span class="bold">Applications</span> menu. Reviewers can assess evidence with relation to the badge criteria (and optionally a rubric), submitting completed reviews in BadgeKit. At this point the API sends notification to the issuer webhook URL, which can issue the badge if the review was a success. The issuer can optionally wait for earner interaction to accept the badge before it is actually issued. The issuer site can also respond to the badge being issued by communicating with the earner as a follow-up.</p> <p>Notice that when you create a badge in BadgeKit, the <span class="bold">Criteria</span> section allows you to add a note for the reviewer &ndash; this will be displayed within BadgeKit when a reviewer assesses a pending badge application.</p> '
    },
    {
      question : 'What is badge status?',
      answer : '<p>You will see badge status information in various places within BadgeKit. The status of a badge tells you where it is in the badging lifecycle. Badge status can be template, draft, published or archived. Published badges are considered active, while archived badges are considered inactive.</p> '
    },
    {
      question : 'What if I want to make changes to a published badge?',
      answer : '<p>Once you publish a badge in BadgeKit, it becomes uneditable. However, if you want to create a slightly different version of the badge, you can copy its content into a new draft badge. BadgeKit will continue to save the badges you work on in draft state until you publish them, so you can carry on making edits in your own time, publishing when you\'re satisfied that the badge is complete.</p> '
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
      answer : '<p>When you work on a badge in BadgeKit, you will see a control to set an expiration date in the Options section. This would be applicable in cases where the skill or achievement that the badge represents has a natural expiry date. </p> <p><ul> <li>For example, if a skill requires continuous learning over time, it could make sense to give its badge validity for a fixed time, so that the earner would have to keep demonstrating the skill repeatedly as time passes. This is a common pattern in areas requiring continuous learning and development such as technology and professional skills. An example of this would be a badge representing a CPR certificate.</li> </ul></p>'
    },
    {
      question : 'How are the badges categorized?',
      answer : '<p>When you create a badge, you can opt to choose types and categories for it. These can be used within the context of the issuer organization. Whether or not you need these types of categorization depends on your own badging programs.</p><p>The badge types relate to the kind of skill or achievement the badge represents. Badge categories relate to the subject matter or activity area represented by the badge.</p><p>BadgeKit currently uses a set of badge types and categories developed in conjunction with partner organizations - we will be carrying out additional developments to the available types and categories to suit a wider range of issuers.</p>'  
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

