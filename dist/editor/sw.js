importScripts("https://storage.googleapis.com/workbox-cdn/releases/6.2.0/workbox-sw.js");

const {registerRoute, setCatchHandler} = workbox.routing;
const {CacheFirst, NetworkFirst, StaleWhileRevalidate} = workbox.strategies;
const {CacheableResponsePlugin} = workbox.cacheableResponse;
const {ExpirationPlugin} = workbox.expiration;
const {PrecacheController, PrecacheRoute, cleanupOutdatedCaches} = workbox.precaching;

self.skipWaiting();
workbox.core.clientsClaim();

const DAY = 24 * 60 * 60; // in seconds
const precache = new PrecacheController();
precache.addToCacheList([{"url":"Advanced-options-ChllnlNh.js","revision":"d85252a5"},{"url":"Assistant-j3pecW0_.js","revision":"f9dd2e27"},{"url":"Battle-Simulator-EvJFGvEI.js","revision":"7ded2987"},{"url":"Changelog-B6-4pvKN.js","revision":"8c05c517"},{"url":"Coastline-Editor-Bm7KFlWw.js","revision":"974602d0"},{"url":"Culture-sets-RreB8VNB.js","revision":"c8a33371"},{"url":"Culture-types-7rOSwQCu.js","revision":"9e7c81d9"},{"url":"Data-import-BsaGOVH0.js","revision":"268236e0"},{"url":"Dependencies-CNvYzxcl.js","revision":"b42a8bc5"},{"url":"Development-BN-b-y2l.js","revision":"ee55bc15"},{"url":"Dropbox-sdk.min-UGaBgXJl.js","revision":"662a9b2a"},{"url":"Economy-Y_v2hyxQ.js","revision":"caf5f515"},{"url":"Emblems-BXjWFa2Q.js","revision":"45dcde6e"},{"url":"GIS-data-export-BC98XCp8.js","revision":"a0decc22"},{"url":"Geographical-Features-Overview-B-dotX0_.js","revision":"c945d555"},{"url":"Goods-spread-functions-CsPG_hhz.js","revision":"264f297b"},{"url":"Heightmap-customization-B6sq7zDt.js","revision":"4e70e91b"},{"url":"Heightmap-image-overlay-DrFCjdsw.js","revision":"7d01eb38"},{"url":"Heightmap-template-editor-Dy3ZRcdZ.js","revision":"1fd8642f"},{"url":"Home-BTGkMFEq.js","revision":"06faa35d"},{"url":"Hotkeys-BHqUDikS.js","revision":"bc49e9cf"},{"url":"Icons-BkM6eRZn.js","revision":"bf9cb478"},{"url":"Install-with-Nix-DyyKMmMl.js","revision":"2a9164a2"},{"url":"Journeys-CYRbQVdj.js","revision":"623b0f17"},{"url":"Knowledge Base-KwMbkGyn.js","revision":"c938c9a3"},{"url":"Map-embellishments-Ds6n3Van.js","revision":"fa7c2f5e"},{"url":"Markers-PNqdas2L.js","revision":"bbb34abc"},{"url":"Military-Forces-h_xBhds3.js","revision":"d02f2e2a"},{"url":"Ollama-text-generation-DP-WeU7w.js","revision":"b66b6c62"},{"url":"Omnibar-xZanHWOb.js","revision":"66fbe327"},{"url":"Performance-settings-DguNxvMG.js","revision":"5190a498"},{"url":"Policy-CQh8hApH.js","revision":"370f3c8f"},{"url":"Q_A-cMf8M3Gq.js","revision":"3edca12e"},{"url":"Quick-Start-Tutorial-BrewJwqQ.js","revision":"6a4e65e8"},{"url":"Reporting-bugs-and-ideas-CJDEmQvV.js","revision":"205507ae"},{"url":"River-Editor-DOlQCgfO.js","revision":"668a799d"},{"url":"Run-FMG-locally-DCjn9mNi.js","revision":"0677e9d0"},{"url":"Scale-and-distance-asbAKBP5.js","revision":"bd902a4f"},{"url":"URL-parameters-Bbj7Po6E.js","revision":"69bcd904"},{"url":"User-Interface-BBvNuQjL.js","revision":"adde9fe4"},{"url":"Working-offline-BjcPaP9y.js","revision":"0f8eb060"},{"url":"Wrap-Tool-CvixOv1C.js","revision":"db37eaea"},{"url":"_Footer-CoCNk46l.js","revision":"6bcf9a6f"},{"url":"added-labels-BmmbiK63.js","revision":"0af92fdb"},{"url":"af-DcZfe6Cv.js","revision":"ef19f5ed"},{"url":"ai-generator-mXACSMu_.js","revision":"d912775e"},{"url":"annex-mode-CA-gPboG.js","revision":"6f5b05e1"},{"url":"app-DI46COQs.js","revision":"8e7719bc"},{"url":"app-offer-nrmPDC4k.js","revision":"76ca9851"},{"url":"assistant-DVMfPzOO.js","revision":"f478f932"},{"url":"auto-update-C2Bs0LLj.js","revision":"d6b72986"},{"url":"axis-ChvWZg1j.js","revision":"6100f9ad"},{"url":"battle-screen-Cz-J_XvU.js","revision":"3d0a00f1"},{"url":"be-DYU1oDln.js","revision":"eec9d215"},{"url":"bg-a3VEfvmf.js","revision":"8159fcf6"},{"url":"biomes-editor-D-yqcltk.js","revision":"31b4eef4"},{"url":"biomes-generator-BPDJoDNS.js","revision":"8ce98a71"},{"url":"bn-BwyK6ovd.js","revision":"84966540"},{"url":"browser-saves-BQRh6sI9.js","revision":"ff25bced"},{"url":"brush-circle-BayJN_M_.js","revision":"d225581e"},{"url":"brush-utils-B5xtY9tr.js","revision":"da893237"},{"url":"burg-creator-DbDZbRKI.js","revision":"7c27c92b"},{"url":"burg-economy-overview-DA4udThs.js","revision":"325665a0"},{"url":"burg-editor-DnUG-Ryy.js","revision":"fd6ab36f"},{"url":"burg-group-editor-DywFCa3v.js","revision":"1b158512"},{"url":"burgs-overview-D06ydKdQ.js","revision":"f94651a6"},{"url":"canvas-DodYEy7v.js","revision":"609cebe3"},{"url":"cell-info-BmiYN8Wl.js","revision":"a3fe5da2"},{"url":"charges-XaoNl-VI.js","revision":"70b970c3"},{"url":"charts-overview-CZ8oqJJ1.js","revision":"d479f6c9"},{"url":"cloud-ZEC5MKZe.js","revision":"81bb888e"},{"url":"coastline-editor-CCMBXR6y.js","revision":"01a5a7e8"},{"url":"color-picker-B3Ry8T6Z.js","revision":"44db5eef"},{"url":"color-utils-CJ0ULp4X.js","revision":"f8eb3413"},{"url":"compare-prices-CTCqUDKD.js","revision":"8b1902ad"},{"url":"configuration-DWy5Kf7_.js","revision":"dbf14ad5"},{"url":"connection-7fv6UzKi.js","revision":"623d90a4"},{"url":"constant-CUk6ox2a.js","revision":"1abf13b6"},{"url":"context-menu-DV-cA8zp.js","revision":"dc519f86"},{"url":"controllers-DjtRWWsG.js","revision":"6f4291a6"},{"url":"controls-JFP3WV_T.js","revision":"4b565290"},{"url":"cs-vrSPyjMi.js","revision":"6eda5d3a"},{"url":"csv-CHOiG9Ph.js","revision":"b0719bf0"},{"url":"csv-upload-Cq_2SXz2.js","revision":"b32bfb57"},{"url":"cultures-editor-DSI32NSh.js","revision":"2219db0e"},{"url":"da-pn98IFX5.js","revision":"e350023a"},{"url":"data-model-l6fRd7lR.js","revision":"b108968a"},{"url":"de-u78jAl-C.js","revision":"ca8f4840"},{"url":"development-editor-DjdDsECM.js","revision":"bc2661af"},{"url":"development-overlay-Tv3NdiDO.js","revision":"b8c46a12"},{"url":"development-view-B6j-TzNR.js","revision":"2ab1f9e9"},{"url":"dialog-D4VWmmDP.js","revision":"513840b9"},{"url":"diplomacy-C1IeajXx.js","revision":"0fc76359"},{"url":"diplomacy-editor-DL92530h.js","revision":"48513e68"},{"url":"diplomacy-overview-BOnl3Hvj.js","revision":"6467c76a"},{"url":"divisions-yddbEqou.js","revision":"c211cf51"},{"url":"drag-CiD4K99c.js","revision":"118b6048"},{"url":"draw-heightmap-P7HDjArL.js","revision":"9236bd30"},{"url":"drawability-CygYGzHT.js","revision":"e8385a95"},{"url":"dropbox.html","revision":"f77bfd7c"},{"url":"economy-overview-BtUwYANv.js","revision":"dee8456a"},{"url":"economy-view-D_mrZonG.js","revision":"3e95a04d"},{"url":"effects-CvQIiKcz.js","revision":"089c022b"},{"url":"el-BtzXpNCY.js","revision":"eb67acbc"},{"url":"elevation-profile-4HGfyutj.js","revision":"3b4aa605"},{"url":"emblem-image-C9gH7NP2.js","revision":"a7fcf6ba"},{"url":"emblems-editor-Dlji7Xst.js","revision":"dde05baa"},{"url":"environment-BDBII_BV.js","revision":"b689f5f0"},{"url":"eras-editor-ComnNOiR.js","revision":"579d6af9"},{"url":"es-Byd5bzcp.js","revision":"cd0ab077"},{"url":"export-BMZaVfwh.js","revision":"9b126463"},{"url":"export-json-iRHt0tNw.js","revision":"eefedefe"},{"url":"features-overview-DetPBSvs.js","revision":"935b2dee"},{"url":"file-name-B95gRTjS.js","revision":"b656d430"},{"url":"file-utils-BGd-Jdi1.js","revision":"98b98fa6"},{"url":"fonts-DdVJ2IL5.js","revision":"5aef83b8"},{"url":"fr-DeWyVkfh.js","revision":"1d78aad3"},{"url":"good-editor-B35YxCgO.js","revision":"b4bb98a9"},{"url":"goods-distribution-editor-C7zsDoix.js","revision":"91072562"},{"url":"goods-editor-DX9UuuO1.js","revision":"2b7b097f"},{"url":"goods-generator-C153Jdbi.js","revision":"d8da6641"},{"url":"graph-override-nSx-suA6.js","revision":"1caaa4cf"},{"url":"header-BI_T7gYY.jpg","revision":"7744a5c4"},{"url":"heightmap-editor-Yyo7-1Dv.js","revision":"f129da06"},{"url":"heightmap-generator-NgRpRyZR.js","revision":"4c27a9a2"},{"url":"heightmap-selection-CkzCgcfG.js","revision":"8496592a"},{"url":"heightmaps/africa-centric.png","revision":"5983b84f"},{"url":"heightmaps/arabia.png","revision":"60e4b200"},{"url":"heightmaps/atlantics.png","revision":"297ee191"},{"url":"heightmaps/britain.png","revision":"184d3e92"},{"url":"heightmaps/caribbean.png","revision":"e3a7f190"},{"url":"heightmaps/east-asia.png","revision":"7a7cc7e1"},{"url":"heightmaps/eurasia.png","revision":"b39d203b"},{"url":"heightmaps/europe-accented.png","revision":"e83ef22a"},{"url":"heightmaps/europe-and-central-asia.png","revision":"a78319b6"},{"url":"heightmaps/europe-central.png","revision":"28f7f5f5"},{"url":"heightmaps/europe-north.png","revision":"5c75687a"},{"url":"heightmaps/europe.png","revision":"7f7debbe"},{"url":"heightmaps/greenland.png","revision":"403c79ec"},{"url":"heightmaps/hellenica.png","revision":"a26c47fe"},{"url":"heightmaps/iceland.png","revision":"9e6b3932"},{"url":"heightmaps/import-rules.txt","revision":"717d7d5b"},{"url":"heightmaps/indian-ocean.png","revision":"0fde55cb"},{"url":"heightmaps/mediterranean-sea.png","revision":"da56ae5f"},{"url":"heightmaps/middle-east.png","revision":"f7764042"},{"url":"heightmaps/north-america.png","revision":"a34787a2"},{"url":"heightmaps/us-centric.png","revision":"8f491da6"},{"url":"heightmaps/us-mainland.png","revision":"4d5b9521"},{"url":"heightmaps/world-from-pacific.png","revision":"64a9b798"},{"url":"heightmaps/world.png","revision":"71e82ef4"},{"url":"hi-Bc0SZeVx.js","revision":"7de9e817"},{"url":"hierarchy-tree-DqK2LnQx.js","revision":"41fe964a"},{"url":"highlight-CXY_4Qeg.js","revision":"9c59091f"},{"url":"highlighting-iHS4x8dQ.js","revision":"e6cd36f1"},{"url":"hu-Rsq85fWi.js","revision":"17937aca"},{"url":"ice-editor-Bo9Q4ajb.js","revision":"c5c3f056"},{"url":"ice-generator-BQo5BcCy.js","revision":"07a0ad4c"},{"url":"icon-picker-eP5RWzMI.js","revision":"ac3d9ed0"},{"url":"icons-archive-C-GmCUVM.js","revision":"08057666"},{"url":"icons-burgs-ReBU_fvu.js","revision":"092a3ad5"},{"url":"icons-charges-agriculture-BkSBg_f6.js","revision":"19f0d99f"},{"url":"icons-charges-architecture-B6c1gnbZ.js","revision":"0777f472"},{"url":"icons-charges-arms-MHy39wx7.js","revision":"f08258d1"},{"url":"icons-charges-beastHeads-nljepei1.js","revision":"0ea79c2c"},{"url":"icons-charges-beasts-BJIBbmh6.js","revision":"dd66b3a1"},{"url":"icons-charges-birds-BR1O6XNf.js","revision":"2d1a4c38"},{"url":"icons-charges-bodyparts-Bek01AVe.js","revision":"904e8f73"},{"url":"icons-charges-bugs-wwzDs9Zt.js","revision":"10044536"},{"url":"icons-charges-conventional-B1h0IKUV.js","revision":"4f7f02bd"},{"url":"icons-charges-crosses-DvoLrs4k.js","revision":"74995521"},{"url":"icons-charges-fantastic-CPjyu_wB.js","revision":"977b3991"},{"url":"icons-charges-fishes-i_9RlJZd.js","revision":"93f208a7"},{"url":"icons-charges-miscellaneous-aiWaz9Fc.js","revision":"0f6c6f47"},{"url":"icons-charges-molluscs-C1P6pZ7O.js","revision":"eb03a9e9"},{"url":"icons-charges-ornaments-BIVHdTrq.js","revision":"a0b6e89f"},{"url":"icons-charges-people-CCNS8tEr.js","revision":"2a6917cf"},{"url":"icons-charges-plants-COpZoa6_.js","revision":"69a07de3"},{"url":"icons-charges-reptiles-BuoBB69G.js","revision":"dbb20fff"},{"url":"icons-charges-seafaring-BeYFjgok.js","revision":"ee8f3c0f"},{"url":"icons-charges-tools-D6ZR0Kb1.js","revision":"5e3b0920"},{"url":"icons-goods-BaT7RnvY.js","revision":"8859bbc5"},{"url":"icons-ports-C3vqFXcU.js","revision":"5e981a40"},{"url":"icons-relief-colored-Buf_LRYD.js","revision":"26502bc4"},{"url":"icons-relief-gray-DOBSOXRD.js","revision":"bb498b0d"},{"url":"icons-relief-illustrated-Cgy8warU.js","revision":"87f49af5"},{"url":"icons-relief-simple-Z6-zpwYe.js","revision":"fc9df39d"},{"url":"icons-relief-stickers-DJ9Ev8_D.js","revision":"97c104c2"},{"url":"id-BGWsMtwR.js","revision":"d050731d"},{"url":"images/Discord.png","revision":"c286fac8"},{"url":"images/Facebook.png","revision":"d8f6fd63"},{"url":"images/Pinterest.png","revision":"8180482a"},{"url":"images/Reddit.png","revision":"1d9fb4c9"},{"url":"images/Twitter.png","revision":"3d4be405"},{"url":"images/icons/favicon-16x16.png","revision":"ef1dc52c"},{"url":"images/icons/favicon-32x32.png","revision":"85b2ed24"},{"url":"images/icons/icon_x512.png","revision":"96db41ec"},{"url":"images/icons/maskable_icon_x128.png","revision":"43deca06"},{"url":"images/icons/maskable_icon_x192.png","revision":"8df7457d"},{"url":"images/icons/maskable_icon_x384.png","revision":"29269c99"},{"url":"images/icons/maskable_icon_x512.png","revision":"a4549048"},{"url":"images/kiwiroo.png","revision":"61f54115"},{"url":"images/markers/ship.svg","revision":"2ab0488f"},{"url":"images/markers/wagon.svg","revision":"b886e64e"},{"url":"images/pattern1.png","revision":"5bed361c"},{"url":"images/pattern2.png","revision":"f0940ccd"},{"url":"images/pattern3.png","revision":"e17a59c5"},{"url":"images/pattern4.png","revision":"4c29905f"},{"url":"images/pattern5.png","revision":"27767e4b"},{"url":"images/pattern6.png","revision":"54e9be30"},{"url":"images/preview.png","revision":"d30e01fe"},{"url":"images/style-presets/ancient.avif","revision":"1f8ce67c"},{"url":"images/style-presets/atlas.avif","revision":"8c4871c4"},{"url":"images/style-presets/cinderwood.avif","revision":"c24dd37c"},{"url":"images/style-presets/clean.avif","revision":"c4cccc45"},{"url":"images/style-presets/cyberpunk.avif","revision":"48b0c56e"},{"url":"images/style-presets/darkSeas.avif","revision":"44b7954c"},{"url":"images/style-presets/default.avif","revision":"347a7e43"},{"url":"images/style-presets/frostbite.avif","revision":"bbbbaeef"},{"url":"images/style-presets/gloom.avif","revision":"0ab45eb3"},{"url":"images/style-presets/ink.avif","revision":"b622b205"},{"url":"images/style-presets/light.avif","revision":"7196d45a"},{"url":"images/style-presets/monochrome.avif","revision":"39b3cdd1"},{"url":"images/style-presets/night.avif","revision":"8d13e517"},{"url":"images/style-presets/pale.avif","revision":"6827632a"},{"url":"images/style-presets/watercolor.avif","revision":"e0c90db2"},{"url":"images/textures/antique-big.jpg","revision":"e018ce4b"},{"url":"images/textures/antique-small.jpg","revision":"18ebde80"},{"url":"images/textures/folded-paper-big.jpg","revision":"eb156d1b"},{"url":"images/textures/folded-paper-small.jpg","revision":"d4588330"},{"url":"images/textures/gray-paper.jpg","revision":"79d3e355"},{"url":"images/textures/iran-small.jpg","revision":"7a2c9c37"},{"url":"images/textures/marble-big.jpg","revision":"264f0ff8"},{"url":"images/textures/marble-blue-big.jpg","revision":"85017608"},{"url":"images/textures/marble-blue-small.jpg","revision":"7aa3717b"},{"url":"images/textures/marble-small.jpg","revision":"062aabd9"},{"url":"images/textures/mars-big.jpg","revision":"e835a07b"},{"url":"images/textures/mars-small.jpg","revision":"6cefbda7"},{"url":"images/textures/mauritania-small.jpg","revision":"8886930b"},{"url":"images/textures/mercury-big.jpg","revision":"1603b5c7"},{"url":"images/textures/mercury-small.jpg","revision":"334fbff6"},{"url":"images/textures/ocean.jpg","revision":"4fc82bfc"},{"url":"images/textures/pergamena-small.jpg","revision":"eeb50ab4"},{"url":"images/textures/plaster.jpg","revision":"0094ce95"},{"url":"images/textures/soiled-paper-vertical.png","revision":"0b33f76d"},{"url":"images/textures/soiled-paper.jpg","revision":"af3e72ba"},{"url":"images/textures/spain-small.jpg","revision":"c7fdf23d"},{"url":"images/textures/timbercut-big.jpg","revision":"1f009d0e"},{"url":"images/textures/timbercut-small.jpg","revision":"93c12f56"},{"url":"images/waves.png","revision":"d6665b72"},{"url":"images/whitecaps.png","revision":"02c85e61"},{"url":"index-DiNRG4NV.js","revision":"0fa565a3"},{"url":"index-DmJ2v1Kj.css","revision":"5bd8b04f"},{"url":"index.html","revision":"1ff695f7"},{"url":"isoline-fills-DwzSIerx.js","revision":"0ba114cf"},{"url":"it-B8aIge6P.js","revision":"4bb43d2e"},{"url":"ja-U-lLPcXm.js","revision":"f7980cbc"},{"url":"journey-editor-Cd9QeNtk.js","revision":"1aa42dfa"},{"url":"journey-travel-dWmDMZqU.js","revision":"91d45590"},{"url":"journeys-generator-DGlrLaf7.js","revision":"e35bd08d"},{"url":"journeys-overview-CicPbGJz.js","revision":"5d587fa6"},{"url":"jszip.min-DHI56sS5.js","revision":"550a01ac"},{"url":"ko-B_vI3XXA.js","revision":"cac7d5ac"},{"url":"label-creator-DIFePNz3.js","revision":"eb105813"},{"url":"labels-editor-DLC1l2w_.js","revision":"485ff273"},{"url":"labels-group-editor-DtFtgkPh.js","revision":"e504b6d3"},{"url":"labels-overview-BPYjoy65.js","revision":"a57d2861"},{"url":"lakes-editor-DnlV0QVX.js","revision":"8704d149"},{"url":"layers-cD4uYvJ_.js","revision":"a7bc55a2"},{"url":"layers-order-iafQJtCL.js","revision":"e495264e"},{"url":"limitation-picker-B1Ffd3h4.js","revision":"e0ab5108"},{"url":"line-weights-DMXPYRDE.js","revision":"3eb2ea6e"},{"url":"linear-CHCBQu2g.js","revision":"4225692d"},{"url":"load-C92p-J3o.js","revision":"09ad7af4"},{"url":"local-db-CPdztq67.js","revision":"33154ddd"},{"url":"lore-editor-Cw616qx2.js","revision":"4fe55ef8"},{"url":"manifest.webmanifest","revision":"b989c1f5"},{"url":"map-brush-BdnxolR8.js","revision":"f00e2523"},{"url":"map-history-XVZGOVG_.js","revision":"dea2a2b3"},{"url":"map-placement-DApFY9in.js","revision":"deaa4425"},{"url":"map-restoration-0VBnNse6.js","revision":"ee027a16"},{"url":"markdown-CKLBkj6p.js","revision":"d0c2a7d9"},{"url":"marker-creator-D1HUCeoV.js","revision":"fc6aeaa3"},{"url":"markers-editor-quQc2Hnk.js","revision":"9833c89d"},{"url":"markers-in-radius-n3FeA8cW.js","revision":"78cd3bc0"},{"url":"markers-overview-DQoSnQec.js","revision":"169ca5b2"},{"url":"markers-settings-DlQ5pzpX.js","revision":"e415ed02"},{"url":"market-deals-overview-DR_jzlWG.js","revision":"05486ac9"},{"url":"market-overview-DBm38RKV.js","revision":"9531896d"},{"url":"markets-overview-_44gQQd0.js","revision":"638c22cf"},{"url":"measurers-editor-BJaSl3Cc.js","revision":"9dd202d2"},{"url":"measurers-generator-DazKvylb.js","revision":"b5a6a570"},{"url":"military-generator-B77sNb6R.js","revision":"42ee4cc0"},{"url":"military-overview-De3GrCzi.js","revision":"25776b41"},{"url":"min-CCch3uox.js","revision":"86bdc159"},{"url":"minimap-Bk8k_o-L.js","revision":"79060b31"},{"url":"names-generator-BCV0nZsN.js","revision":"70093109"},{"url":"namesbase-editor-C1qeVASC.js","revision":"f07e9e58"},{"url":"nl-QWQ-kjIe.js","revision":"17bca346"},{"url":"node-utils-exnnnMLT.js","revision":"006eb881"},{"url":"notes-XrU-WLgv.js","revision":"ef230d5b"},{"url":"notes-editor-BsUe4DTB.js","revision":"04343e5e"},{"url":"notes-editor-DVB7LGv8.css","revision":"f77202e3"},{"url":"notices-cecdGZzo.js","revision":"bc8b29d9"},{"url":"number-Da26Xeod.js","revision":"92812e9d"},{"url":"omnibar-BpobYpaU.js","revision":"3be628c6"},{"url":"options-model-BpAETY5z.js","revision":"a976392a"},{"url":"ordinaries-DXI0TOB4.js","revision":"79525c24"},{"url":"pack-CyBKcrr4.js","revision":"f082fa13"},{"url":"pack-generator-BuIcHPWx.js","revision":"82d0d727"},{"url":"packed-graph-Urze5Qyp.js","revision":"096ee943"},{"url":"paint-editor-BlNNw8sg.js","revision":"a6915b1b"},{"url":"pictures-CxZp7pE-.js","revision":"f1f10211"},{"url":"pl-BzKJnt7R.js","revision":"9bfdd393"},{"url":"platform-CzZogJkH.js","revision":"81b49246"},{"url":"production-chains-DbH-B5Gr.js","revision":"038c0f6d"},{"url":"production-generator-B6SIEt8g.js","revision":"d20a6cec"},{"url":"prosperity-BsFyL3nd.js","revision":"88079275"},{"url":"provinces-editor-CTHOqGQR.js","revision":"d605a129"},{"url":"provinces-regeneration-DcGk_3fR.js","revision":"18f96ab4"},{"url":"pt-BR-zGfKOSe-.js","revision":"16feb294"},{"url":"pt-cZjDRZtA.js","revision":"966ef00d"},{"url":"regiment-editor-CXownCc-.js","revision":"9c0b377b"},{"url":"regiments-overview-CbiRlkxw.js","revision":"e418a3c4"},{"url":"registry-CwrTqJ86.js","revision":"f6d60ff3"},{"url":"release-notes-DDe4d9Wt.js","revision":"05d80ad3"},{"url":"relief-editor-CL3QQOwD.js","revision":"d94babae"},{"url":"relief-pool-editor-C1E7LPbe.js","revision":"59fbd2b5"},{"url":"relief-previews-YWfIVMYr.js","revision":"d4e1ae49"},{"url":"relief-rules-editor-_2ydGiPj.js","revision":"15eb2640"},{"url":"religions-editor-B29zB3o3.js","revision":"66e0644d"},{"url":"reveal-BjIARwK9.js","revision":"70b98d7b"},{"url":"river-auto-creator-BqDdwtaw.js","revision":"5c2996ff"},{"url":"river-creator-n6DDZUOc.js","revision":"b477ec0b"},{"url":"river-editor-9LL5Aj6b.js","revision":"925139b2"},{"url":"river-groups-editor-C5xO8eTl.js","revision":"aae609e2"},{"url":"rivers-overview-9wGkvrEn.js","revision":"17ca7695"},{"url":"ro-BPrhSbba.js","revision":"c339b0db"},{"url":"rolldown-runtime-COiEfhsA.js","revision":"174e7e98"},{"url":"route-creator-BJI8DxkH.js","revision":"1ccd7bbf"},{"url":"route-editor-CxreLVKw.js","revision":"cfdbc071"},{"url":"route-groups-editor-B3sCgTMH.js","revision":"191ffa94"},{"url":"routes-overview-CjvcB14P.js","revision":"a4670496"},{"url":"ru-CnqJBHVH.js","revision":"fb9375f6"},{"url":"schema-form-BDy1gRkK.js","revision":"d8ae0def"},{"url":"services-CcmSCzae.js","revision":"57e69e64"},{"url":"shields-QQIBRbRT.js","revision":"20fc9de2"},{"url":"sortable-list-D24Td52Y.js","revision":"b4a80a1e"},{"url":"sortable-list-z9wS_2BE.css","revision":"597f47cc"},{"url":"stability-overview-BMonPHwT.js","revision":"fa40254d"},{"url":"stability-tAO3O8fb.js","revision":"ae485801"},{"url":"state-B2hBYDzv.js","revision":"566a1269"},{"url":"state-budget-editor-B6DHdOaq.js","revision":"4c47d013"},{"url":"states-editor-BpsXWLpS.js","revision":"5087dfed"},{"url":"stratify-CGdiYggi.js","revision":"171bdc70"},{"url":"style-CBaKQQWU.js","revision":"6a28f295"},{"url":"style-preset-C-F0J-xp.js","revision":"a7fb05a9"},{"url":"style-presets-eJ8n6J59.js","revision":"0947224f"},{"url":"style-reference-BYMSgNtj.js","revision":"bad524b3"},{"url":"styles-BOavvP_x.js","revision":"77f5cc18"},{"url":"styles/ancient.json","revision":"d7665409"},{"url":"styles/atlas.json","revision":"96de5274"},{"url":"styles/cinderwood.json","revision":"93dc4b67"},{"url":"styles/clean.json","revision":"ad65ab22"},{"url":"styles/cyberpunk.json","revision":"95917ea3"},{"url":"styles/darkSeas.json","revision":"bc50288a"},{"url":"styles/frostbite.json","revision":"18bc213e"},{"url":"styles/gloom.json","revision":"373b3ad4"},{"url":"styles/ink.json","revision":"5549e625"},{"url":"styles/light.json","revision":"9ba5cb9f"},{"url":"styles/monochrome.json","revision":"724d3ede"},{"url":"styles/night.json","revision":"e9310c6b"},{"url":"styles/pale.json","revision":"fa2fc1b8"},{"url":"styles/watercolor.json","revision":"b68f22fb"},{"url":"submap-tool-BYDTpB-F.js","revision":"ac022a0c"},{"url":"sv-DZMx1Byx.js","revision":"9522c2a3"},{"url":"table-DmPgM_Jh.js","revision":"e7b03990"},{"url":"temperature-generator-32KQSbsB.js","revision":"e3bb7ba0"},{"url":"temperature-graph-13V22J5Y.js","revision":"83cc131e"},{"url":"textures-Cc_MGAZY.js","revision":"ceba55cf"},{"url":"th-DJ0ORWZG.js","revision":"93257626"},{"url":"tinctures-CsgIeV6I.js","revision":"f7c1cb15"},{"url":"tooltips-B64CH7zD.js","revision":"c47187a5"},{"url":"tr-DfwqsdcW.js","revision":"dab8f42f"},{"url":"trade-animation-editor-qbqkqh-g.js","revision":"72fbbfe5"},{"url":"trade-details-Da7mCB14.js","revision":"d6ea38a3"},{"url":"transform-tool-Bz7NqGPC.js","revision":"58f7d5f4"},{"url":"transport-editor-TKr06msg.js","revision":"f649222e"},{"url":"ui-tour-CWXCubYt.css","revision":"ff1934a5"},{"url":"ui-tour-GCfWcr58.js","revision":"22b77e85"},{"url":"uk-kz3XU7Z9.js","revision":"88c1c092"},{"url":"units-DCf1j2gX.js","revision":"79af10df"},{"url":"units-editor-CkvfoBzn.js","revision":"2f84a6db"},{"url":"vi-noHmy76V.js","revision":"e312beff"},{"url":"view-3d-CuFftYmF.js","revision":"405cf947"},{"url":"view-3d-renderer-DbNl1s3G.js","revision":"2707c629"},{"url":"world-configurator-D65Vj-OD.js","revision":"8a5b2866"},{"url":"world-rGEaygGY.js","revision":"33894b86"},{"url":"wrap-tool-BCzArVJe.js","revision":"2bddca9a"},{"url":"zh-CQm4mOEi.js","revision":"474c3f49"},{"url":"zh-TW-CNHGILEL.js","revision":"3dbc527f"},{"url":"zones-editor-KpjGK0gD.js","revision":"55681ea0"},{"url":"zoom-BC8QU5QD.js","revision":"d89df628"}] || []);
const assets = new CacheFirst({
  cacheName: precache.strategy.cacheName,
  plugins: [...precache.strategy.plugins, new CacheableResponsePlugin({statuses: [200]})]
});
const runtimeAssets = new CacheFirst({
  cacheName: "fmg-assets",
  plugins: [...assets.plugins, new ExpirationPlugin({maxEntries: 100, maxAgeSeconds: 30 * DAY})]
});
const indexURL = new URL("index.html", self.location.href).href;
const offlineCacheName = `fmg-offline-${self.registration.scope}`;
let offlineDownload;

registerRoute(
  ({request}) => request.mode === "navigate",
  new NetworkFirst({
    networkTimeoutSeconds: 15,
    cacheName: "fmg-html",
    plugins: [
      new CacheableResponsePlugin({statuses: [0, 200]}),
      {cachedResponseWillBeUsed: async ({cachedResponse}) => (await offlinePage()) || cachedResponse}
    ]
  })
);

cleanupOutdatedCaches();
const assetRoute = new PrecacheRoute(precache, {ignoreURLParametersMatching: [/.*/]});
registerRoute(assetRoute.match, async options => {
  const stamp = options.url.searchParams.get("v");
  if (/^[a-f0-9]{8}$/.test(stamp)) {
    // Keep content-hash stamps from stamp-assets.js tied to their original revision.
    const key = new URL(options.params.cacheKey);
    key.searchParams.set("__WB_REVISION__", stamp);
    options.params.cacheKey = key.href;
  }
  return (await caches.match(options.params.cacheKey, {cacheName: assets.cacheName})) || runtimeAssets.handle(options);
});

self.addEventListener("message", event => {
  if (event.data?.type !== "CACHE_OFFLINE") return;
  offlineDownload ||= cacheOffline(event).finally(() => { offlineDownload = undefined; });
  event.waitUntil(offlineDownload.then(
    () => event.ports[0]?.postMessage({type: "CACHE_OFFLINE", ok: true}),
    error => {
      console.warn("Offline caching failed: ", error);
      event.ports[0]?.postMessage({type: "CACHE_OFFLINE", ok: false});
    }
  ));
});

async function cacheOffline(event) {
  const offlineCache = await caches.open(offlineCacheName);
  const previous = await offlinePage();
  if (previous) await offlineCache.put(indexURL, previous);

  // Commit the offline page and remove old assets only after the whole download succeeds.
  const urls = precache.getCachedURLs().filter(url => url !== indexURL);
  urls.push(indexURL);
  for (const url of urls) {
    const request = new Request(url, {cache: "reload", credentials: "same-origin"});
    const [response] = await Promise.all(assets.handleAll({event, request}));
    if (response.status !== 200) throw new Error(`Cannot cache ${url}: ${response.status}`);
  }
  await offlineCache.put(indexURL, await precache.matchPrecache(indexURL));
  await precache.activate(event);
}

async function offlinePage() {
  const offlineCache = await caches.open(offlineCacheName);
  const cache = await caches.open(assets.cacheName);
  return (await offlineCache.match(indexURL)) || cache.match(indexURL, {ignoreSearch: true});
}

setCatchHandler(async ({request}) => {
  if (request.mode === "navigate") return (await offlinePage()) || Response.error();
  const cache = await caches.open(assets.cacheName);
  return (await cache.match(request, {ignoreSearch: true})) || Response.error();
});

const retainedAssets = {
  cachedResponseWillBeUsed: async ({request, cachedResponse}) =>
    cachedResponse || caches.match(request, {cacheName: assets.cacheName, ignoreSearch: true})
};

// Google-hosted scripts (analytics) are left to the browser: with a blocker installed the
// request never gets a response, and a worker strategy would surface that as an uncaught error
registerRoute(
  ({request, url}) =>
    request.destination === "script" &&
    !url.pathname.endsWith("min.js") &&
    !url.hostname.includes("google"),
  new StaleWhileRevalidate({
    cacheName: "fmg-scripts",
    plugins: [
      new CacheableResponsePlugin({statuses: [0, 200]}),
      new ExpirationPlugin({maxEntries: 100, maxAgeSeconds: 30 * DAY}),
      retainedAssets
    ]
  })
);

registerRoute(
  ({request}) => request.destination === "style",
  new CacheFirst({
    cacheName: "fmg-stylesheets",
    plugins: [
      new CacheableResponsePlugin({statuses: [0, 200]}),
      new ExpirationPlugin({maxEntries: 100, maxAgeSeconds: 30 * DAY}),
      retainedAssets
    ]
  })
);

registerRoute(
  ({request, url}) => request.destination === "script" && url.pathname.endsWith("min.js"),
  new CacheFirst({
    cacheName: "fmg-libs",
    plugins: [
      new CacheableResponsePlugin({statuses: [0, 200]}),
      new ExpirationPlugin({maxEntries: 100, maxAgeSeconds: 30 * DAY}),
      retainedAssets
    ]
  })
);

registerRoute(
  new RegExp(".json$"),
  new CacheFirst({
    cacheName: "fmg-json",
    plugins: [
      new CacheableResponsePlugin({statuses: [0, 200]}),
      new ExpirationPlugin({maxEntries: 100, maxAgeSeconds: 30 * DAY}),
      retainedAssets
    ]
  })
);

registerRoute(
  ({request}) => request.destination === "image",
  new CacheFirst({
    cacheName: "fmg-images",
    plugins: [
      new CacheableResponsePlugin({statuses: [0, 200]}),
      new ExpirationPlugin({maxEntries: 100, maxAgeSeconds: 60 * DAY}),
      retainedAssets
    ]
  })
);

registerRoute(
  ({request}) => request.destination === "font",
  new CacheFirst({
    cacheName: "fmg-fonts",
    plugins: [
      new CacheableResponsePlugin({statuses: [0, 200]}),
      new ExpirationPlugin({maxEntries: 100, maxAgeSeconds: 60 * DAY}),
      retainedAssets
    ]
  })
);
