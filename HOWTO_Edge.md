
# Creating an uploadable package for Edge

Edge is by far the most difficult platform to build for so far!

Here are most of the steps.

## Fixing up the Extension for Edge

Edge is seriously borked, and needs some fixup code in order to run a web
extension that Chrome and Firefox can run just as it is.

0. Install git, vim, gnuwin tools to pull down the extension
   From git

1. Obtain the Microsoft Edge Extension Toolkit from the MS Store

2. Make the necessary changes. I didn't notice any code changes,
   but the tool added some MS files and really changed the manifest.
   It also added a background page to run the event.js code, because
   MS doesn't fully understand background pages.

   The tool also didn't like the README.md in th historical folder,
   so you may need to zap that.


## Test running the Extension

1. Open Edge and goto about:flags.

   Turn on extension developing

2. Close and restart edge

3. Go to "..." in Edge -> Extensions, then scroll to the bottom 
   to find load, then load the extension locally and try it out. 
   You probably will have to turn it on again, too.

Test in the normal manner.


## Packaging The Extension


0. Install nodejs
1. Install manifoldjs 

   `npm -g install manifoldjs`

2. Use manifoldjs to pre-package the extension.

   https://docs.microsoft.com/en-us/microsoft-edge/extensions/guides/packaging/using-manifoldjs-to-package-extensions
 
   `manifoldjs -l debug -p edgeextension -f edgeextension -m <...>\Detrumpify\manifest.json -d workarea`

3. Then you have to edit: `<workarea>/Detrumpify/edgeextension/manifest/appxmanifest.xml`

   You'll need to adjust some icon locations and fix the publisher identifier:


```
<?xml version="1.0" encoding="utf-8"?>
<Package 
	xmlns="http://schemas.microsoft.com/appx/manifest/foundation/windows10"
	xmlns:uap="http://schemas.microsoft.com/appx/manifest/uap/windows10"
	xmlns:uap3="http://schemas.microsoft.com/appx/manifest/uap/windows10/3"
	IgnorableNamespaces="uap3">
	<Identity 
		Name="secret_stuff"
		Publisher="CN=secret_stuff"
		Version="1.2.8.0" />

	<Properties> 
		<DisplayName>Detrumpify</DisplayName> 
		<PublisherDisplayName>Tools of Our Tools</PublisherDisplayName>
		<Logo>Assets\dt-50.png</Logo> 
	</Properties> 

	<Dependencies> 
		<TargetDeviceFamily Name="Windows.Desktop" MinVersion="10.0.15063.0" MaxVersionTested="10.0.15063.0" />
	</Dependencies> 

	<Resources>
		<Resource Language="en-us" />
		<Resource uap:Scale="200"/>
	</Resources> 

	<Applications> 
		<Application Id="App">
			<uap:VisualElements
				AppListEntry="none"
				DisplayName="Detrumpify"
				Square150x150Logo="Assets\dt-150.png"
				Square44x44Logo="Assets\dt-44.png"
				Description="Replaces references to Donald Trump with more accurate descriptions."
				BackgroundColor="transparent">
			</uap:VisualElements>
			<Extensions>
				<uap3:Extension Category="windows.appExtension">
					<uap3:AppExtension
						Name="com.microsoft.edge.extension"
						Id="EdgeExtension"
						PublicFolder="Extension"
						DisplayName="Detrumpify">
						<uap3:Properties>
							<Capabilities>
								<Capability Name="websiteContent"/>
								<Capability Name="browserStorage"/>
								<Capability Name="websiteInfo"/>
							</Capabilities>
						</uap3:Properties>
					</uap3:AppExtension>
				</uap3:Extension>
			</Extensions>
		</Application> 
	</Applications>
</Package>
```


4. For those icon files, copy over everything from icons/ folder to the <workearea>\Detrumpify\edgeextension\Assets folder.

5. Now you need to re-run manifold to actually package the extension:

    `manifoldjs -l debug -p edgeextension package <workarea>\Detrumpify\edgeextension\manifest\`

   This will create the packaged extension itself, which you will find in <workarea>\Detrumpify\edgeextension\package


## Testing the package

Testing on of these appx packages is not easy. You need to sign it before you can test it.

### Create a self-signed certificate

### 


https://partner.microsoft.com/en-us/dashboard/products/9P38V28D5LGL/submissions/1152921505688100241/packages


how to package 
https://docs.microsoft.com/en-us/microsoft-edge/extensions/guides/packaging

how to use manifoldjs
https://docs.microsoft.com/en-us/microsoft-edge/extensions/guides/packaging/using-manifoldjs-to-package-extensions

how to copy the stuff you need for the other manifest (id, etc)
https://docs.microsoft.com/en-us/microsoft-edge/extensions/guides/packaging/creating-and-testing-extension-packages#app-identity-template-values

creating a certificate and making it trusted
https://docs.microsoft.com/en-us/microsoft-edge/extensions/guides/packaging/creating-and-testing-extension-packages#testing-an-appx-package

https://docs.microsoft.com/en-us/windows/uwp/packaging/create-certificate-package-signing

https://docs.microsoft.com/en-us/windows/desktop/appxpkg/how-to-sign-a-package-using-signtool

https://docs.microsoft.com/en-us/powershell/module/pkiclient/export-certificate?view=win10-ps


