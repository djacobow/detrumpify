import SimpleHTTPServer
import SocketServer

port = 8000

handler = SimpleHTTPServer.SimpleHTTPRequestHandler
httpd   = SocketServer.TCPServer(("",port), handler)
print "serving at port", port
httpd.serve_forever()


