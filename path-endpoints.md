======================= PATHS FOR A MVP VERSION ======================
FRONTEND PATHS:
	Home								/
	Sign in								/signin
	Sign up								/signup
	Sign out							/signout
	Forget pwd							/forget
	Contact	us							/contact
	About								/about


	STORIES:
		Story Index (All Articles)		/stories

		All Columns 					/stories/columns 
		* News Index (All News)  		/stories/news 
		Column Index					/stories/:column-slug
		
		Story Page						/stories/:column-slug/:story-slug/:sid
		* News Page (has no column) 	/stories/news/:story-slug/:sid
		

	USER:
		NO USERNAME:
			Public Profile					/u/:uid
			-Public stories					/u/:uid/stories
			Public story page 				/u/:uid/stories/:story-slug/:sid
			-Public upvotes					/u/:uid/upvotes

		WITH USERNAME
			Public Profile					/@:username 
			-Public stories					/@:username/stories
			Public story page 				/@:username/stories/:story-slug/:sid
			-Public upvotes					/@:username/upvotes

	TAG:
		Tag page 						/tags/:tag-slug
		(future) Trending tags 			/tags


OWNER PATHS:
	Owner's stories						/me/stories 
	Owner's drafts						/me/stories/drafts
	Owner's story 						/me/stories/:sid

	Owner's profile setting				/me/settings
	Owner's account setting				/me/settings/account


EDITOR PATHS:
	Overall Dashboard						/editor
	Publisher Contact and About				/editor/contact 
	Publisher Settings						/editor/settings 
	
	EDITOR STORY SECTION:
		Editor Published Stories			/editor/stories 					?sort=recent / trending / popular
																				?column=columnid
		New Story 							/editor/stories/new 				The story belongs to the publisher
																				So, it can be edited by editor of which column the story submitted.
																				Published story must have a column, but the draft isn't required.
																				So, editor can only edit a draft that's already choosen the column.
		Edit Story 							/editor/stories/:storyid/edit  		Edit the story, granted only for owner, editor of this column, admin
																				All drafted/published/scheduled stories can be edited.
		Editor Drafted Stories 				/editor/stories/drafts
		Column Settings 					/editor/columns/:column-id/settings
		// Column create is a popup

		

=================== SERVICE ENDPOINTS FOR MVP VERSION ================
// TODO
USER
*	Auth with FB 							GET 		/auth/facebook  
*	Generate Token 							POST 		/auth 												{username, password}			{token}
*	Get user's public detail 				GET 		/users/:uid 																		{user}
*	Get owner's private detail 				GET 		/users/:uid 		 								{token} 						{user} 
*	Update user's detail 					PATCH 		/users/:uid	 										{user} 							{user}
*	Upload user's profile pic 				POST 		/users/:uid/photo 									{token, photo} 					{sizes}
*	Register new user 						POST  		/users 												{email, password} 				{token, user}

ROLE
*	Add publisher's admin 					POST 		/publishers/:pid/admins/:uidOrEmail 				{token} 						{role, admins}
*	Get publisher's admins 					GET 		/publishers/:pid/admins 															{admins}
*	Remove publisher's admin 				DELETE 		/publishers/:pid/admins/:uid 						{token} 						{role, admins}

*	Add col's writer 						POST  		/publishers/:pid/columns/:cid/writers/:uidOrEmail 	{token} 						{role, writers}
*	Add col's editor 						POST  		/publishers/:pid/columns/:cid/editors/:uidOrEmail 	{token} 						{role, editors}
*	Remove col's writer 					DELETE 		/publishers/:pid/columns/:cid/writers/:uid 			{token}							{role, writers}
*	Remove col's editor 					DELETE 		/publishers/:pid/columns/:cid/editors/:uid 			{token}							{role, editors}
*	Get col's writers 						GET 		/publishers/:pid/columns/:cid/writers 												{writers}
*	Get col's editors 						GET 		/publishers/:pid/columns/:cid/editors 												{editors}	
*	Get all publisher's writers				GET 		/publishers/:pid/writers 															{writers}
*	Get all publisher's editors				GET 		/publishers/:pid/editors 															{editors}

TAG
    *** SHOULD EDIT THIS, TAG SHOULD STAND BY ITSELF, NOT TO DEPEND ON THE PUBLISHER ***
*	Create publisher tag 					POST 		/publishers/:pid/tags 								{token, tagName} 				{tag}
*	Get publisher's tags 					GET 		/publishers/:pid/tags 								{(keyword)}						{tags}
*	Remove publisher's tag 					DELETE 		/publishers/:pid/tags/:tid 							{token} 						{tag}
*	Get public tag detail 					GET 		/publishers/:pid/tags/:tid 															{tag}
*	Add story's tag 						POST 		/publishers/:pid/stories/:sid/tags/:tid				{token} 						{tag}				cause we want tag slug back
*	Remove story's tag 						DELETE 		/publishers/:pid/stories/:sid/tags/:tid 			{token} 						{tag}

CONTACT
	Contact submitted 						POST  		/publishers/:pid/contacts 							{contact}						{contact} 			*this method will send an email as well
	Get contacts 							GET 		/publishers/:pid/contacts															{contacts}

PUBLISHER 
*	Get publisher's public detail 			GET 		/publishers/:pid 																	{publisher, columns}
*	Get publisher's private detail 			GET 		/publishers/:pid 									{token}							{publisher, columns}
*	Update publisher's detail 				PATCH 		/publishers/:pid 									{token, publisher} 				{publisher} 
*	Upload publisher's cover photo 			POST 		/publishers/:pid/cover 								{token, cover} 					{cover} 			cover: {paths:[''], filename:''}
*	Upload publisher's logo 				POST 		/publishers/:pid/logo 								{token, logo} 					{logo}				logo: {paths:[''], filename:''}
*	Upload publisher's square logo  		POST 		/publishers/:pid/square-logo 						{token, square-logo} 			{square-logo} 		square-logo: {paths:[''], filename:''}

COLUMN
*	Add publisher col 						POST 		/publishers/:pid/columns 							{token, col} 					{column}
*	Remove publisher col 					DELETE 		/publishers/:pid/columns/:cid 						{token} 						{column}
*	Update col detail 						PATCH 		/publishers/:pid/columns/:cid 						{token} 						{column}
*	Upload col's cover 						POST 		/publishers/:pid/cover 								{token, cover} 					{cover}				cover: {paths:[''], filename:''}
*	Get publisher's cols 
*	- ?sort : trending/latest/popular		GET 		/publishers/:pid/columns 							{sort}							{columns}
*	Get col's public detail 				GET 		/publishers/:pid/columns/:cid 														{column} 

INSIGHT 
	Increment story insight					POST 		/insights/stories/:sid/:action						{token}			 				{insight}
	Decrement story insight 				DELETE 		/insights/stories/:sid/:action						{token}							{insight}			this is used when downvote for example, not for view, share, and click
	Get insights by daterange				GET 		/insights/stories/:sid/:action						{token, (from), (to), (period)}	{insights} 			period = pastsevendays/aweekago/twoweeksago 

MENU
	Get publisher and user navigation		GET 		/navigation											{?uid, pid} 					{navigation}

STORIES
*	Create a story 							POST 		/stories/:sid 										{token, story} 					{story} 			no need for html, we just want slug back
*	Delete a story 							DELETE 		/stories/:sid 										{token} 						{story}
*	Get story detail 						GET 		/stories/:sid 						 												{story}				including minor detail of column, tags
*	Update story detail 					PATCH 		/stories/:sid 										{token, story} 					{story}
*	Upload story cover 						POST 		/stories/:sid/cover 								{token, cover} 					{cover} 			cover: {paths:[''], filename:''}
*	Upload story portrait cover 			POST 		/stories/:sid/portrait-cover 						{token, portrait-cover} 		{portrait-cover} 	portrait-cover: {paths:[''], filename:''}

FEED
 *	Get feed 								GET 		/publishers/:pid/feed  								{type, (sort), (sortby), (filter)}		{feed, count}	feed response is like [{type:'story', ...}, {type:'video', ...}]
 	- type : 'all'. 'story', 'video', 'qa'
 	- ?sort : trending/latest/popular, Note for a story: popular=most viewed, latest=published, trending=unsupported yet
 	- ?sortby : depend on the type, e.g. for a story: 'published', 'writer', 'created', 'title', etc.
 	- ?filter : depend on the type, e.g. for a story: 'column', 'topic', 'program', 'tag'

SLUG
*	Get column by slug 						GET 		/slugs/publishers/:pid/columns/:column-slug 		{(token)} 						{column}			same as get column (private & public)
*	Get user by username 					GET			/slugs/users/:username								{(token)} 						{user} 				same as get user (private & public)
	Get tag by tag slug 					GET 		/slugs/publishers/:pid/tags/:tag 					{(token)} 						{tag} 				same as get tag (private & public)

COMMENT
	G

====================== PATHS FOR A FULL VERSION ======================

FRONTEND PATHS:
	Home								/
	Sign in								/signin
	Sign up								/signup
	Sign out							/signout
	Forget pwd							/forget
	Contact	us							/contact
	About								/about
	Advertise with us 					/advertise
	Terms and Privacies					/terms


	STORIES:
		Story Index (All Stories)		/stories

		All Columns 					/stories/columns 
		Column Index					/stories/:column-slug
		Column Followers				/stories/:column-slug/followers
		
		Story Page						/stories/:column-slug/:story-slug


	VIDEOS:
		Video Index (All Videos)		/videos

		All Programs					/videos/programs
		Program Index					/videos/:program-slug
		Program Followers				/videos/:program-slug/followers

		Video Page						/vidoes/:program-slug/:video-slug


	QA:
		QA Index (All QA)				/qa

		All topics						/qa/topics
		Topic Index						/qa/:topic-slug
		Topic Followers					/qa/:topic-slug/followers

		QA Page							/qa/:topic-slug/:qa-slug


	TAG:
		Tag Page 						/tags/:tag-slug


	USER:
		Public Profile					/@:username 
		Public stories					/@:username/stories
		Public upvotes					/@:username/upvotes
		Public followings				/@:username/followings
		Public followers				/@:username/followers


OWNER PATHS:
	Owner's bookmarks					/me/bookmarks						including story, vdo, QA

	Owner's stories						/me/stories 
	Owner's drafted stories				/me/stories/drafts
	Owner's scheduled stories			/me/stories/schedules

	Owner's videos						/me/videos 
	Owner's drafted videos				/me/videos/drafts
	Owner's scheduled videos			/me/videos/schedules

	Owner's questions					/me/qa == /me/questions
	Owner's answers						/me/qa/answers						QA is able to be drafted as well

	Owner's profile setting				/me/settings 
	Owner's account setting				/me/settings/account



EDITOR PATHS:
	Overall Dashboard						/editor
	Publisher Contact and About				/editor/contact 
	Publisher Settings						/editor/settings 
	Send Message 							/editor/message
	
	EDITOR STORY SECTION:
		Editor Published Stories			/editor/stories 					?sort=recent / trending / popular
																				?find=keyword
																				?column=columnid
		New Story 							/editor/stories/new 				The story belongs to the publisher
																				So, it can be edited by editor of which column the story submitted.
																				Published story must have a column, but the draft isn't required.
																				So, editor can only edit a draft that's already choosen the column.
		Edit Story 							/editor/stories/:storyid/edit  		Edit the story, granted only for owner, editor of this column, admin
																				All drafted/published/scheduled stories can be edited.
		Editor Drafted Stories 				/editor/stories/drafts
		Editor Scheduled Stories 			/editor/stories/schedules
		Column Dashboard (Future)			/editor/columns
		Column Settings 					/editor/columns/:column-id/settings
		// Column create is a popup


	EDITOR QA SECION: 
		Editor Published Questions			/editor/questions					?sort=recent / trending / popular / unanswered
																				?find=keyword
																				?topic=qid
		New Question 						/editor/questions/new 				The question belongs to the publisher.
																				So, it can be edited by editor of which topic the question submitted.
																				Question cannot be drafted or scheduled.
		Edit Question 						/editor/questions/:qid/edit  		Edit the question, granted only for owner, editor of this topic, admin.
		Topic Dashboard (Future)			/editor/topics 
		Topic Settings 						/editor/topics/:topic-id/settings
		// Topic create is a popup


	EDITOR VIDEO SECION: 
		Editor Published Videos				/editor/videos 						?sort=recent / trending / popular
																				?find=keyword
																				?program=programid
		New Video 							/editor/videos/new 					The video belongs to the publisher
																				So, it can be edited by editor of which column the story submitted.
																				Published video must have a topic, but the draft isn't required.
																				So, editor can only edit a draft that's already choosen the topic.
		Edit Video 							/editor/videos/:vid/edit  			Edit the video, granted only for owner, editor of this column, admin
																				All drafted/published/scheduled videos can be edited.
		Editor Drafted Videos				/editor/videos/drafts
		Editor Scheduled Videos 			/editor/videos/schedules
		Program Dashboard (Future)			/editor/topics
		Program Settings 					/editor/topics/:topic-id/settings
		// Program create is a popup
	