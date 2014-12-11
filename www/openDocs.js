
/**
* OpenDocs plugin for PhoneGap
* 
* @constructor
*/
function OpenDocs(){ }

OpenDocs.prototype.open = function(success,fail,text) {
	cordova.exec(success,fail,"OpenDocs","open", [text]);
}


/**
* Register the plugin with PhoneGap
*/

cordova.addConstructor(function()  {
	if(!window.plugins)
	{
		window.plugins = {};
	}
					   
	// shim to work in 1.5 and 1.6
	if (!window.Cordova) {
		window.Cordova = cordova;
	};
					   
	window.plugins.OpenDocs = new OpenDocs();
});
						 
(function($){
	$(document).on('click.downloadFile', 'a[download-file]', function(e){
		
		var done = 1;
		
		var onFail = function () {
			//TODO notification
			if (!done) return;
			done = 0;
			if (window.requestCount > 0) window.requestCount--;
			window.updateSpinner();
		};
   
		var onDownloadFail = function (error) {
			onFail();
		};
   
		var onOpeningFail = function (e) {
			onFail();
		};
   
		var onOpeningSuccess = function (e) {
			if (!done) return;
			done = 0;
			window.requestCount--;
			window.updateSpinner();
		};
   
		var onDownloadSuccess = function (entry) {
			if (!done) return;
			var filePathDownloaded = entry.toURL();
			setTimeout(function () {
				plugins.OpenDocs.open(onOpeningSuccess, onOpeningFail, filePathDownloaded);
			}, 100);
		};
		
		setTimeout(function(){
			onFail();
		}, 30000);
		
		e.preventDefault();
		e.stopImmediatePropagation();
		var extRegex = /^\.[a-z]{2,4}$/i;
		var element = $(e.target);
		var remoteFile = element.attr('href');
		// leggi l'estensione dall'attributo
		var ext = element.attr('download-file');
		// se non c'e' leggila dal remote file come ultimo parametro
		if (!extRegex.test(ext)) ext = remoteFile.substr(remoteFile.lastIndexOf("."));
		// se non c'e' usa pdf
		if (!extRegex.test(ext)) ext = '.pdf';
		
		var localFileName = 'Download' + (+new Date) + ext;
     
		window.requestCount++;
		window.updateSpinner();
		
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
			fileSystem.root.getFile(localFileName, { create: true, exclusive: false }, function (fileEntry) {
				var localPath = fileEntry.toURL();
				if (device.platform === "Android" && localPath.indexOf("file://") === 0) {
					localPath = localPath.substring(7);
				}
				var ft = new FileTransfer();
				ft.download(remoteFile, localPath, onDownloadSuccess, onDownloadFail);
			}, onFail);
		}, onFail);
	});
})(jQuery);