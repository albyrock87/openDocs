//
//  ClipboardPlugin.h
//  Clipboard plugin for PhoneGap
//
//  Copyright 2010 Michel Weimerskirch.
//

#import <Foundation/Foundation.h>
#import <Cordova/CDVPlugin.h>

@interface OpenDocs : CDVPlugin<UIDocumentInteractionControllerDelegate>{

    UIDocumentInteractionController *uidController;
}

 -(void)open:(CDVInvokedUrlCommand*)command;


@end
