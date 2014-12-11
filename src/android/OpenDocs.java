package ##PACKAGE##;

import java.io.File;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaResourceApi;
import org.json.JSONArray;
import org.json.JSONException;

import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Uri;
import android.os.Environment;
import android.util.Log;
import org.apache.cordova.file.*;

public class OpenDocs extends CordovaPlugin {
	
	private static final String actionOpen = "open";
	private static final String errorUnknown = "Unknown Error";
	
	/**
	 * Executes the request and returns PluginResult.
	 *
	 * @param action
	 *            The action to execute.
	 * @param args
	 *            JSONArry of arguments for the plugin.
	 * @param callbackId
	 *            The callback id used when calling back into JavaScript.
	 * @return A PluginResult object with a status and message.
	 */	
	public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {

		Log.e("", "action: "+action);
		if (action.equals(actionOpen)) {
			try {
				String cdvUrl = (String) args.get(0);

				final CordovaResourceApi resourceApi = webView.getResourceApi();				
				final Uri sourceUri = resourceApi.remapUri(Uri.parse(cdvUrl));
				final CallbackContext ctx = callbackContext;
				final CordovaPlugin self = this;
				
				cordova.getThreadPool().execute(new Runnable() {
		            public void run() {
		                try {
							File file = resourceApi.mapUriToFile(sourceUri);

							Intent target = new Intent(Intent.ACTION_VIEW);
		    				
							String ext = android.webkit.MimeTypeMap.getFileExtensionFromUrl(Uri.fromFile(file).toString());
							String mimetype = android.webkit.MimeTypeMap.getSingleton().getMimeTypeFromExtension(ext);
		    				
							target.setDataAndType(Uri.fromFile(file), mimetype);
		    				
		    				try {
		    					self.cordova.getActivity().startActivity(target);
		    				} catch (ActivityNotFoundException e) {
		    				    // Instruct the user to install a PDF reader here, or something
		    				} 
		    				ctx.success();
		                } catch (Exception e) {
		                	ctx.error(errorUnknown);
		    			}
		            }
				});	
			}  catch (Exception e) {
				callbackContext.error(errorUnknown);
				return false;
			}
			return true;
		}else{
			callbackContext.error("Ivalid action");
			return false;
		}
	}
}
