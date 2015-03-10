# Review 3 NP sets

## Warning of stability
These NP sets are _NOT_ tested regularly as part of the acceptance, integration or unit tests due to rather complex system requirements (some require TV/Kiosk, other require several SP3 applications as well as rule based and statistical MMs). They were tested and working as per January 2015 during the year 3 review meeting.

## Walkthrough of each NP set and demo set up.

For the full story and details on this scenario, see: https://docs.google.com/document/d/13fqxn2kpmLcdDkSnHKKpW3DtHaKVxP_zyA92-NqxWLU/edit


### Scenario 1: Vladimir on several devices

Vladimir is a user with low vision on a business trip in Munich.
He is a Windows user who usually combines JAWS; high contrast, large cursor with mousetrails He speaks english but not German. Tomorrow he has a meeting. 

####Demo 1.1:
* **Backstory**: He arrives at the hotel in the evening and remembers he forgot to pay his landlady before he left. He goes to the lobby and sits in front of a Windows 7 workstation there to access his bank and pay the rent bill. (The computer does not have JAWS installed)
* **Device reporter**: `deviceReporter/review3/installedSolutionsVladimirLobby.json`
* **NP Set**: `vladimir`
* **Device requirement**: Windows 7, Cloud4Chrome plugin installed, NVDA installed
* **Other requirements**: He has a preference for the rule based MM, so that should be present on the declared URL.
* **Expected behavior**: NVDA screenreader on (speechRate, no auto-say-all on pageload), high contrast on, large mouse pointer, mouse trails, cloud4chrome configured with higher contrast but not launched

####Demo 1.2:
* **Backstory:** In his room, Vladimir wants to check out what’s on TV before going to bed. 
Inserts his USB KeyToken into the TV system.
* **Device reporter:** `deviceReporter/review3/installedSolutionsVladimirHotel.json`
* **NP Set:** `vladimir_smm`
* **Device requirement:** A smart TV
* **Other requirements**: He has a preference for the statistical MM, so that should be present on the declared URL.
* **Expected behavior:** The audio description is enabled, and the contrast is enhanced.

####Demo 1.3:
* **Backstory:** The next morning, 
Vladimir goes to a bus station to buy a ticket at a ticket vending machine. 
Uses the bar code on his KeyToken Card to Key-in
* **Device reporter:** `deviceReporter/review3/installedSolutionsVladimirVending.json`
* **NP Set:** `vladimir_smm`
* **Device requirement:** Ticket vending machine
* **Other requirements**: He has a preference for the statistical MM, so that should be present on the declared URL.
* **Expected behavior:** larger fonts, a clearer fontface, a high-contrast theme, larger buttons on screen

####Demo 1.4:
* **Backstory:** 
Finally, on the way to his meeting, he checks his, twitter, in the subway. Both lighting and noise change continually, his smartphone adapts to the varying environment according to his preferences – which sometimes go in the opposite direction of standard device adaptations.
(e.g. user needs to keep brightness close to the same, reducing it only a small amount, where the standard device would decrease the brightness too much for them making it unreadable)
* **Device reporter:** `deviceReporter/review3/installedSolutionsVladimirAndroid.json`
* **NP Set:** `vladimir`
* **Device requirement:** Android, smart twitter installed, environment reporter enabled
* **Other requirements**: He has a preference for the RB MM, so that should be present on the declared URL.
* **Expected behavior:** System level: fontsize increase, no brightness decrease. Smarttwitter: contrast enabled, bigger font-size


### Scenario 2: Several students on 1 device (and later multiple)

The second sceanrio focus on how the Cloud4all/GPII can allow single devices in a classroom to adapt to many different individuals throughout a day. (In Short: One device encountering many individuals. )

We visit a Teacher in a classroom with many students who have disabilities. Here we can see how individual devices can adapt to different users. We can also see how the Cloud4all/GPII can make the adaptation process easier and much simpler to understand for the teacher. The teachers do not themselves have to learn all the different devices and how to set each on up for each different student. These same attributes and advantages would also apply in other public, shared places like libraries, and public access points as well as in homes where people need to share computers, TV systems, thermostats and other electronic devices in the home.


This is the first day of class and because many students without disabilities have not been in a class with people with disabilities 
the Teacher explains to class on the first day that the computers in the classroom will automatically adapt to students that need special settings whenever they use their Key-Tokens with the computers. 
The other students are told that they can also all get their own KeyToken that will save and restore their preferences as well. 

The teacher then has each student with a disability who wants to, come up and demonstrate the computers automatically setting up for them -- and explaining how the system adapts for them.    
They also show the systems instantly resets when they key-out. 

#### Demo 2.1: Mary
* **Backstory:** who uses an onscreen keyboard comes up first
* **Device reporter:** `deviceReporter/review3/installedSolutionsClassroomWindows.json`
* **NP Set:** `mary`
* **Device requirement:** Windows 7 with: highContrast hack from steve lee, NVDA, supernova, read & write gold installed
* **Other requirements**: User has a preference for the Rulebased MM, so that should be present on the declared URL.
* **Expected behavior:** automatically launching her onscreen keyboard

#### Demo 2.2: Manuel
* **Backstory:**  He has low vision
* **Device reporter:** `deviceReporter/review3/installedSolutionsClassroomWindows.json`
* **NP Set:** `manuel`
* **Device requirement:** Windows 7 with: highContrast hack from steve lee, NVDA, supernova, read & write gold installed
* **Other requirements**: User has a preference for the Rulebased MM, so that should be present on the declared URL.
* **Expected behavior:** automatically activating the Windows Built-in Magnifier 

#### Demo 2.3: Chris
* **Backstory:**  also has low vision, but prefers to use a screen reader.  
 He shows how he can make the screen resolution instantly change so he can see generally what is happening on the screen better,  and simultaneously activates a screen reader that reads everything aloud to him as he moves about on the screen.
* **Device reporter:** `deviceReporter/review3/installedSolutionsClassroomWindows.json`
* **NP Set:** `chris`
* **Device requirement:** Windows 7 with: highContrast hack from steve lee, NVDA, supernova, read & write gold installed
* **Other requirements**: User has a preference for the Rulebased MM, so that should be present on the declared URL.
* **Expected behavior:** NVDA with 350wpm, braille enabled, screen resolution decreased

#### Demo 2.4: Li
* **Backstory:**  is next and prefers speech and Magnifier so her preferences ask that SuperNova, an integrated screenreader-magnifier to be launched and configured for her. Here the matchmakers detect that supernova covers both the needs for screenreader and magnifier, neither of the other tools (built in screen reader / nvda) are launched (as supernova is preferred) - but they _are_ configured.
* **Device reporter:** `deviceReporter/review3/installedSolutionsClassroomWindows.json`
* **NP Set:** `li`
* **Device requirement:** Windows 7 with: highContrast hack from steve lee, NVDA, supernova, read & write gold installed
* **Other requirements**: User has a preference for the Rulebased MM, so that should be present on the declared URL.
* **Expected behavior:** Supernova with speech and magnification launched

#### Demo 2.5: Sharing a device
* **Backstory:**  Chris (Christophe) 
(who used NVDA and Screen resolution change on his computer above) now steps up again and demonstrates how he can share his own Android tablet running Mobile Accessibility with other visually impaired users in the class who have different needs and settings. 
He uses this tablet for notetaking, he combines very high speech rate with Braille output.   (Pause of Chris to show)
He can share the tablet (or show information on the tablet)  with Li, who is low vision with some skills on screen reader usage but doesn’t know Braille and also prefers a lower speech rate.
He explains that Li can just hold her KeyToken up to the back of the tablet and MA would stop Braille output and slow down the speech rate to her preference.   (Pause for Li)
She could use the device for a while, look at the notes Chris has been taking, and when she's done she can use her KeyToken again to log out or just hand it back to Chris who can use his KeyToken to change it back to Braille comes back and speech rate goes to the high value that Chris prefers. 
* **NP Set:** `chris` and `li`
* **Device requirement:** Android with Mobile Accessibility
* **Other requirements**: User has a preference for the Rulebased MM, so that should be present on the declared URL.
* **Expected behavior:** Mobile accessiblity will change the speech rate (and some more subtle settings) when the two users are switching the device

#### Demo 2.6: Context Aware Server
* **Backstory:**  At some point,  the teacher shows slides and turns down the room lighting.  At the moment Rob is using a Windows7 laptop to search the web and Manbuel is using linux. Turning down the lights is not a problem for most of the students but  Manuel and bob cannot see the  material on their screens, if the laptop screen dims too much (which is what the laptop usually does).  So both computers responds according to their preferences.
* **Device reporter:** regular device reporter files for the two OS'
* **NP Set:** `rob` and `manuel`
* **Device requirement:** One computer with Windows 7 and google chrome plugin, One computer running fedora 20 with google chrome plugin installed.
* **Other requirements**: One user has a preference for the Rulebased MM, so that should be present on the declared URL. Context aware server should be up and running and the two devices should have the correct URL for it
* **Expected behavior:**: Linux: On dimmed light the font the font size should decrease and in the google chrome the magnification should decrease. On windows, high contrast should be enabled inside the google chrome browser.