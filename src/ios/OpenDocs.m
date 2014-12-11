//
//  ClipboardPlugin.m
//  Clipboard plugin for PhoneGap
//
//  Copyright 2010 Michel Weimerskirch.
//

#import <Foundation/Foundation.h>
#import <Cordova/CDVPlugin.h>
#import <Cordova/CDVPluginResult.h>
#import "CDVFile.h"
#import "AppDelegate.h"
#import "OpenDocs.h"

extern CDVFile *filePlugin;

@implementation OpenDocs

-(void)open:(CDVInvokedUrlCommand*)command;{
    
    CDVPluginResult* pluginResult = nil;
    @try{
        NSString* fileCDVUrl = [command.arguments objectAtIndex:0];
        
        CDVFilesystemURL *sourceURL = [CDVFilesystemURL fileSystemURLWithString:fileCDVUrl];
        NSObject<CDVFileSystem> *fs = [filePlugin filesystemForURL:sourceURL];
        NSString* filePath = [fs filesystemPathForURL:sourceURL];
        NSURL* url;
		  // continua a cambiare Cordova, quindi devo fare mille controlli per capire cosa mi sta mandando il JS
        if (filePath == nil) {
            url = [NSURL URLWithString:fileCDVUrl];
            if(![url.absoluteString hasPrefix:@"file://"]){
                url = [NSURL fileURLWithPath:fileCDVUrl];
            }
        }
        else {
            url = [NSURL fileURLWithPath:filePath];
        }
        
        uidController = [UIDocumentInteractionController interactionControllerWithURL:url];
        [uidController setDelegate:self];
        [uidController presentPreviewAnimated:YES];
        
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    }@catch(NSException *error){
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:error.reason];
    }
    
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    
}
    
-(UIViewController *)documentInteractionControllerViewControllerForPreview:(UIDocumentInteractionController *)controller{

    AppDelegate *app =  [[UIApplication sharedApplication] delegate];
    
    return app.viewController;
}


@end
