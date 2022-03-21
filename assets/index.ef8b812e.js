import{l as Q,$ as O,u as ft}from"./vendor.285dd04e.js";const ut=function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))f(r);new MutationObserver(r=>{for(const u of r)if(u.type==="childList")for(const d of u.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&f(d)}).observe(document,{childList:!0,subtree:!0});function i(r){const u={};return r.integrity&&(u.integrity=r.integrity),r.referrerpolicy&&(u.referrerPolicy=r.referrerpolicy),r.crossorigin==="use-credentials"?u.credentials="include":r.crossorigin==="anonymous"?u.credentials="omit":u.credentials="same-origin",u}function f(r){if(r.ep)return;r.ep=!0;const u=i(r);fetch(r.href,u)}};ut();var nt=globalThis&&globalThis.__extends||function(){var n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(a,i){a.__proto__=i}||function(a,i){for(var f in i)i.hasOwnProperty(f)&&(a[f]=i[f])};return function(a,i){n(a,i);function f(){this.constructor=a}a.prototype=i===null?Object.create(i):(f.prototype=i.prototype,new f)}}(),z;(function(n){var a=function(){function s(){}return s}();n.Point=a;var i=function(){function s(){}return s}();n.ClusterObject=i;var f=1,r=Math.pow(2,53)-1,u=function(s){nt(t,s);function t(e,o,h,_,p,g){h===void 0&&(h={}),p===void 0&&(p=1),g===void 0&&(g=!1);var l=s.call(this)||this;return l.data=h,l.position={lat:+e,lng:+o},l.weight=p,l.category=_,l.filtered=g,l.hashCode=f++,l}return t.prototype.Move=function(e,o){this.position.lat=+e,this.position.lng=+o},t.prototype.SetData=function(e){for(var o in e)this.data[o]=e[o]},t}(i);n.Marker=u;var d=function(s){nt(t,s);function t(e){var o=s.call(this)||this;return o.stats=[0,0,0,0,0,0,0,0],o.data={},e?(t.ENABLE_MARKERS_LIST&&(o._clusterMarkers=[e]),o.lastMarker=e,o.hashCode=31+e.hashCode,o.population=1,e.category!==void 0&&(o.stats[e.category]=1),o.totalWeight=e.weight,o.position={lat:e.position.lat,lng:e.position.lng},o.averagePosition={lat:e.position.lat,lng:e.position.lng},o):(o.hashCode=1,t.ENABLE_MARKERS_LIST&&(o._clusterMarkers=[]),o)}return t.prototype.AddMarker=function(e){t.ENABLE_MARKERS_LIST&&this._clusterMarkers.push(e);var o=this.hashCode;o=(o<<5)-o+e.hashCode,o>=r?this.hashCode=o%r:this.hashCode=o,this.lastMarker=e;var h=e.weight,_=this.totalWeight,p=h+_;this.averagePosition.lat=(this.averagePosition.lat*_+e.position.lat*h)/p,this.averagePosition.lng=(this.averagePosition.lng*_+e.position.lng*h)/p,++this.population,this.totalWeight=p,e.category!==void 0&&(this.stats[e.category]=this.stats[e.category]+1||1)},t.prototype.Reset=function(){this.hashCode=1,this.lastMarker=void 0,this.population=0,this.totalWeight=0,this.stats=[0,0,0,0,0,0,0,0],t.ENABLE_MARKERS_LIST&&(this._clusterMarkers=[])},t.prototype.ComputeBounds=function(e){var o=e.Project(this.position.lat,this.position.lng),h=e.Size,_=Math.floor(o.x/h),p=Math.floor(o.y/h),g=_*h,l=p*h,m=e.UnProject(g,l),C=e.UnProject(g+h,l+h);this.bounds={minLat:C.lat,maxLat:m.lat,minLng:m.lng,maxLng:C.lng}},t.prototype.GetClusterMarkers=function(){return this._clusterMarkers},t.prototype.ApplyCluster=function(e){this.hashCode=this.hashCode*41+e.hashCode*43,this.hashCode>r&&(this.hashCode=this.hashCode=r);var o=e.totalWeight,h=this.totalWeight,_=o+h;this.averagePosition.lat=(this.averagePosition.lat*h+e.averagePosition.lat*o)/_,this.averagePosition.lng=(this.averagePosition.lng*h+e.averagePosition.lng*o)/_,this.population+=e.population,this.totalWeight=_,this.bounds.minLat=Math.min(this.bounds.minLat,e.bounds.minLat),this.bounds.minLng=Math.min(this.bounds.minLng,e.bounds.minLng),this.bounds.maxLat=Math.max(this.bounds.maxLat,e.bounds.maxLat),this.bounds.maxLng=Math.max(this.bounds.maxLng,e.bounds.maxLng);for(var p in e.stats)e.stats.hasOwnProperty(p)&&(this.stats.hasOwnProperty(p)?this.stats[p]+=e.stats[p]:this.stats[p]=e.stats[p]);t.ENABLE_MARKERS_LIST&&(this._clusterMarkers=this._clusterMarkers.concat(e.GetClusterMarkers()))},t.ENABLE_MARKERS_LIST=!1,t}(i);n.Cluster=d;function c(s,t){return s.lat>=t.minLat&&s.lat<=t.maxLat&&s.lng>=t.minLng&&s.lng<=t.maxLng}function M(s){for(var t=1,e,o,h,_=s.length;t<_;++t){for(o=s[t],h=o.position.lng,e=t-1;e>=0&&s[e].position.lng>h;--e)s[e+1]=s[e];s[e+1]=o}}function y(s,t){return t>300?!1:t/s<.2}var I=function(){function s(){this._markers=[],this._nbChanges=0,this._clusters=[],this.Size=166,this.ViewPadding=.2}return s.prototype.RegisterMarker=function(t){t._removeFlag&&delete t._removeFlag,this._markers.push(t),this._nbChanges+=1},s.prototype.RegisterMarkers=function(t){var e=this;t.forEach(function(o){e.RegisterMarker(o)})},s.prototype._sortMarkers=function(){var t=this._markers,e=t.length;this._nbChanges&&!y(e,this._nbChanges)?this._markers.sort(function(o,h){return o.position.lng-h.position.lng}):M(t),this._nbChanges=0},s.prototype._sortClusters=function(){M(this._clusters)},s.prototype._indexLowerBoundLng=function(t){for(var e=this._markers,o,h,_=0,p=e.length;p>0;)h=Math.floor(p/2),o=_+h,e[o].position.lng<t?(_=++o,p-=h+1):p=h;return _},s.prototype._resetClusterViews=function(){for(var t=0,e=this._clusters.length;t<e;++t){var o=this._clusters[t];o.Reset(),o.ComputeBounds(this)}},s.prototype.ProcessView=function(t){var e=Math.abs(t.maxLat-t.minLat)*this.ViewPadding,o=Math.abs(t.maxLng-t.minLng)*this.ViewPadding,h={minLat:t.minLat-e-e,maxLat:t.maxLat+e+e,minLng:t.minLng-o-o,maxLng:t.maxLng+o+o};this._sortMarkers(),this._resetClusterViews();for(var _=this._indexLowerBoundLng(h.minLng),p=this._markers,g=this._clusters,l=g.slice(0),m=_,C=p.length;m<C;++m){var P=p[m],k=P.position;if(k.lng>h.maxLng)break;if(k.lat>h.minLat&&k.lat<h.maxLat&&!P.filtered){for(var R=!1,b,B=0,A=l.length;B<A;++B){if(b=l[B],b.bounds.maxLng<P.position.lng){l.splice(B,1),--B,--A;continue}if(c(k,b.bounds)){b.AddMarker(P),R=!0;break}}R||(b=new d(P),b.ComputeBounds(this),g.push(b),l.push(b))}}var U=[];for(m=0,C=g.length;m<C;++m)b=g[m],b.population>0&&U.push(b);return this._clusters=U,this._sortClusters(),this._clusters},s.prototype.RemoveMarkers=function(t){if(!t){this._markers=[];return}for(var e=0,o=t.length;e<o;++e)t[e]._removeFlag=!0;var h=[];for(e=0,o=this._markers.length;e<o;++e)this._markers[e]._removeFlag?delete this._markers[e]._removeFlag:h.push(this._markers[e]);this._markers=h},s.prototype.FindMarkersInArea=function(t){for(var e=t.minLat,o=t.maxLat,h=t.minLng,_=t.maxLng,p=this._markers,g=[],l=this._indexLowerBoundLng(h),m=l,C=p.length;m<C;++m){var P=p[m].position;if(P.lng>_)break;P.lat>=e&&P.lat<=o&&P.lng>=h&&g.push(p[m])}return g},s.prototype.ComputeBounds=function(t,e){if(e===void 0&&(e=!0),!t||!t.length)return null;for(var o=Number.MAX_VALUE,h=-Number.MAX_VALUE,_=Number.MAX_VALUE,p=-Number.MAX_VALUE,g=0,l=t.length;g<l;++g)if(!(!e&&t[g].filtered)){var m=t[g].position;m.lat<o&&(o=m.lat),m.lat>h&&(h=m.lat),m.lng<_&&(_=m.lng),m.lng>p&&(p=m.lng)}return{minLat:o,maxLat:h,minLng:_,maxLng:p}},s.prototype.FindMarkersBoundsInArea=function(t){return this.ComputeBounds(this.FindMarkersInArea(t))},s.prototype.ComputeGlobalBounds=function(t){return t===void 0&&(t=!0),this.ComputeBounds(this._markers,t)},s.prototype.GetMarkers=function(){return this._markers},s.prototype.GetPopulation=function(){return this._markers.length},s.prototype.ResetClusters=function(){this._clusters=[]},s}();n.PruneCluster=I})(z||(z={}));var z;(function(n){})(z||(z={}));var pt=(L.Layer?L.Layer:L.Class).extend({initialize:function(n,a){var i=this;n===void 0&&(n=120),a===void 0&&(a=20),this.Cluster=new z.PruneCluster,this.Cluster.Size=n,this.clusterMargin=Math.min(a,n/4),this.Cluster.Project=function(f,r){return i._map.project(new L.LatLng(f,r),Math.floor(i._map.getZoom()))},this.Cluster.UnProject=function(f,r){return i._map.unproject(new L.Point(f,r),Math.floor(i._map.getZoom()))},this._objectsOnMap=[],this.spiderfier=new dt(this),this._hardMove=!1,this._resetIcons=!1,this._removeTimeoutId=0,this._markersRemoveListTimeout=[]},RegisterMarker:function(n){this.Cluster.RegisterMarker(n)},RegisterMarkers:function(n){this.Cluster.RegisterMarkers(n)},RemoveMarkers:function(n){this.Cluster.RemoveMarkers(n)},BuildLeafletCluster:function(n,a){var i=this,f=new L.Marker(a,{icon:this.BuildLeafletClusterIcon(n)});return f._leafletClusterBounds=n.bounds,f.on("click",function(){var r=f._leafletClusterBounds,u=i.Cluster.FindMarkersInArea(r),d=i.Cluster.ComputeBounds(u);if(d){var c=new L.LatLngBounds(new L.LatLng(d.minLat,d.maxLng),new L.LatLng(d.maxLat,d.minLng)),M=i._map.getZoom(),y=i._map.getBoundsZoom(c,!1,new L.Point(20,20));if(y===M){for(var I=[],s=0,t=i._objectsOnMap.length;s<t;++s){var e=i._objectsOnMap[s];e.data._leafletMarker!==f&&e.bounds.minLat>=r.minLat&&e.bounds.maxLat<=r.maxLat&&e.bounds.minLng>=r.minLng&&e.bounds.maxLng<=r.maxLng&&I.push(e.bounds)}if(I.length>0){var o=[],h=I.length;for(s=0,t=u.length;s<t;++s){for(var _=u[s].position,p=!1,g=0;g<h;++g){var l=I[g];if(_.lat>=l.minLat&&_.lat<=l.maxLat&&_.lng>=l.minLng&&_.lng<=l.maxLng){p=!0;break}}p||o.push(u[s])}u=o}u.length<200||y>=i._map.getMaxZoom()?i._map.fire("overlappingmarkers",{cluster:i,markers:u,center:f.getLatLng(),marker:f}):y++,i._map.setView(f.getLatLng(),y)}else i._map.fitBounds(c)}}),f},BuildLeafletClusterIcon:function(n){var a="prunecluster prunecluster-",i=38,f=this.Cluster.GetPopulation();return n.population<Math.max(10,f*.01)?a+="small":n.population<Math.max(100,f*.05)?(a+="medium",i=40):(a+="large",i=44),new L.DivIcon({html:"<div><span>"+n.population+"</span></div>",className:a,iconSize:L.point(i,i)})},BuildLeafletMarker:function(n,a){var i=new L.Marker(a);return this.PrepareLeafletMarker(i,n.data,n.category),i},PrepareLeafletMarker:function(n,a,i){if(a.icon&&(typeof a.icon=="function"?n.setIcon(a.icon(a,i)):n.setIcon(a.icon)),a.popup){var f=typeof a.popup=="function"?a.popup(a,i):a.popup;n.getPopup()?n.setPopupContent(f,a.popupOptions):n.bindPopup(f,a.popupOptions)}},onAdd:function(n){this._map=n,n.on("movestart",this._moveStart,this),n.on("moveend",this._moveEnd,this),n.on("zoomend",this._zoomStart,this),n.on("zoomend",this._zoomEnd,this),this.ProcessView(),n.addLayer(this.spiderfier)},onRemove:function(n){n.off("movestart",this._moveStart,this),n.off("moveend",this._moveEnd,this),n.off("zoomend",this._zoomStart,this),n.off("zoomend",this._zoomEnd,this);for(var a=0,i=this._objectsOnMap.length;a<i;++a)n.removeLayer(this._objectsOnMap[a].data._leafletMarker);this._objectsOnMap=[],this.Cluster.ResetClusters(),n.removeLayer(this.spiderfier),this._map=null},_moveStart:function(){this._moveInProgress=!0},_moveEnd:function(n){this._moveInProgress=!1,this._hardMove=n.hard,this.ProcessView()},_zoomStart:function(){this._zoomInProgress=!0},_zoomEnd:function(){this._zoomInProgress=!1,this.ProcessView()},ProcessView:function(){var n=this;if(!(!this._map||this._zoomInProgress||this._moveInProgress)){for(var a=this._map,i=a.getBounds(),f=Math.floor(a.getZoom()),r=this.clusterMargin/this.Cluster.Size,u=this._resetIcons,d=i.getSouthWest(),c=i.getNorthEast(),M=this.Cluster.ProcessView({minLat:d.lat,minLng:d.lng,maxLat:c.lat,maxLng:c.lng}),y=this._objectsOnMap,I=[],s=new Array(y.length),t=0,e=y.length;t<e;++t){var o=y[t].data._leafletMarker;s[t]=o,o._removeFromMap=!0}var h=[],_=[],p=[],g=[];for(t=0,e=M.length;t<e;++t){for(var l=M[t],m=l.data,C=(l.bounds.maxLat-l.bounds.minLat)*r,P=(l.bounds.maxLng-l.bounds.minLng)*r,k=0,R=g.length;k<R;++k){var b=g[k];if(b.bounds.maxLng<l.bounds.minLng){g.splice(k,1),--k,--R;continue}var B=b.averagePosition.lng+P,A=b.averagePosition.lat-C,U=b.averagePosition.lat+C,J=l.averagePosition.lng-P,q=l.averagePosition.lat-C,Y=l.averagePosition.lat+C;if(B>J&&U>q&&A<Y){m._leafletCollision=!0,b.ApplyCluster(l);break}}m._leafletCollision||g.push(l)}for(M.forEach(function(v){var T=void 0,x=v.data;if(x._leafletCollision){x._leafletCollision=!1,x._leafletOldPopulation=0,x._leafletOldHashCode=0;return}var D=new L.LatLng(v.averagePosition.lat,v.averagePosition.lng),S=x._leafletMarker;if(S){if(v.population===1&&x._leafletOldPopulation===1&&v.hashCode===S._hashCode)(u||S._zoomLevel!==f||v.lastMarker.data.forceIconRedraw)&&(n.PrepareLeafletMarker(S,v.lastMarker.data,v.lastMarker.category),v.lastMarker.data.forceIconRedraw&&(v.lastMarker.data.forceIconRedraw=!1)),S.setLatLng(D),T=S;else if(v.population>1&&x._leafletOldPopulation>1&&(S._zoomLevel===f||x._leafletPosition.equals(D))){if(S.setLatLng(D),u||v.population!=x._leafletOldPopulation||v.hashCode!==x._leafletOldHashCode){var et={};L.Util.extend(et,v.bounds),S._leafletClusterBounds=et,S.setIcon(n.BuildLeafletClusterIcon(v))}x._leafletOldPopulation=v.population,x._leafletOldHashCode=v.hashCode,T=S}}T?(T._removeFromMap=!1,I.push(v),T._zoomLevel=f,T._hashCode=v.hashCode,T._population=v.population,x._leafletMarker=T,x._leafletPosition=D):(v.population===1?_.push(v):h.push(v),x._leafletPosition=D,x._leafletOldPopulation=v.population,x._leafletOldHashCode=v.hashCode)}),h=_.concat(h),t=0,e=y.length;t<e;++t){l=y[t];var V=l.data;if(o=V._leafletMarker,V._leafletMarker._removeFromMap){var H=!0;if(o._zoomLevel===f){var Z=l.averagePosition;for(C=(l.bounds.maxLat-l.bounds.minLat)*r,P=(l.bounds.maxLng-l.bounds.minLng)*r,k=0,R=h.length;k<R;++k){var w=h[k],N=w.data;if(o._population===1&&w.population===1&&o._hashCode===w.hashCode)(u||w.lastMarker.data.forceIconRedraw)&&(this.PrepareLeafletMarker(o,w.lastMarker.data,w.lastMarker.category),w.lastMarker.data.forceIconRedraw&&(w.lastMarker.data.forceIconRedraw=!1)),o.setLatLng(N._leafletPosition),H=!1;else{var K=w.averagePosition,lt=Z.lng-P,ht=K.lng+P;if(B=Z.lng+P,A=Z.lat-C,U=Z.lat+C,J=K.lng-P,q=K.lat-C,Y=K.lat+C,o._population>1&&w.population>1&&B>J&&lt<ht&&U>q&&A<Y){o.setLatLng(N._leafletPosition),o.setIcon(this.BuildLeafletClusterIcon(w));var j={};L.Util.extend(j,w.bounds),o._leafletClusterBounds=j,N._leafletOldPopulation=w.population,N._leafletOldHashCode=w.hashCode,o._population=w.population,H=!1}}if(!H){N._leafletMarker=o,o._removeFromMap=!1,I.push(w),h.splice(k,1),--k,--R;break}}}H&&(o._removeFromMap||console.error("wtf"))}}for(t=0,e=h.length;t<e;++t){l=h[t],V=l.data;var tt=V._leafletPosition,E;l.population===1?E=this.BuildLeafletMarker(l.lastMarker,tt):E=this.BuildLeafletCluster(l,tt),E.addTo(a),E.setOpacity(0),p.push(E),V._leafletMarker=E,E._zoomLevel=f,E._hashCode=l.hashCode,E._population=l.population,I.push(l)}if(window.setTimeout(function(){for(t=0,e=p.length;t<e;++t){var v=p[t];v._icon&&L.DomUtil.addClass(v._icon,"prunecluster-anim"),v._shadow&&L.DomUtil.addClass(v._shadow,"prunecluster-anim"),v.setOpacity(1)}},1),this._hardMove)for(t=0,e=s.length;t<e;++t)o=s[t],o._removeFromMap&&a.removeLayer(o);else{if(this._removeTimeoutId!==0)for(window.clearTimeout(this._removeTimeoutId),t=0,e=this._markersRemoveListTimeout.length;t<e;++t)a.removeLayer(this._markersRemoveListTimeout[t]);var F=[];for(t=0,e=s.length;t<e;++t)o=s[t],o._removeFromMap&&(o.setOpacity(0),F.push(o));F.length>0&&(this._removeTimeoutId=window.setTimeout(function(){for(t=0,e=F.length;t<e;++t)a.removeLayer(F[t]);n._removeTimeoutId=0},300)),this._markersRemoveListTimeout=F}this._objectsOnMap=I,this._hardMove=!1,this._resetIcons=!1}},FitBounds:function(n){n===void 0&&(n=!0);var a=this.Cluster.ComputeGlobalBounds(n);a&&this._map.fitBounds(new L.LatLngBounds(new L.LatLng(a.minLat,a.maxLng),new L.LatLng(a.maxLat,a.minLng)))},GetMarkers:function(){return this.Cluster.GetMarkers()},RedrawIcons:function(n){n===void 0&&(n=!0),this._resetIcons=!0,n&&this.ProcessView()}}),dt=(L.Layer?L.Layer:L.Class).extend({_2PI:Math.PI*2,_circleFootSeparation:25,_circleStartAngle:Math.PI/6,_spiralFootSeparation:28,_spiralLengthStart:11,_spiralLengthFactor:5,_spiralCountTrigger:8,spiderfyDistanceMultiplier:1,initialize:function(n){this._cluster=n,this._currentMarkers=[],this._multiLines=!!L.multiPolyline,this._lines=this._multiLines?L.multiPolyline([],{weight:1.5,color:"#222"}):L.polyline([],{weight:1.5,color:"#222"})},onAdd:function(n){this._map=n,this._map.on("overlappingmarkers",this.Spiderfy,this),this._map.on("click",this.Unspiderfy,this),this._map.on("zoomend",this.Unspiderfy,this)},Spiderfy:function(n){var a=this;if(n.cluster===this._cluster){this.Unspiderfy();var i=n.markers.filter(function(t){return!t.filtered});this._currentCenter=n.center;var f=this._map.latLngToLayerPoint(n.center),r;i.length>=this._spiralCountTrigger?r=this._generatePointsSpiral(i.length,f):(this._multiLines&&(f.y+=10),r=this._generatePointsCircle(i.length,f));for(var u=[],d=[],c=[],M=0,y=r.length;M<y;++M){var I=this._map.layerPointToLatLng(r[M]),s=this._cluster.BuildLeafletMarker(i[M],n.center);s.setZIndexOffset(5e3),s.setOpacity(0),this._currentMarkers.push(s),this._map.addLayer(s),d.push(s),c.push(I)}window.setTimeout(function(){for(M=0,y=r.length;M<y;++M)d[M].setLatLng(c[M]).setOpacity(1);var t=+new Date,e=42,o=290,h=window.setInterval(function(){u=[];var _=+new Date,p=_-t;if(p>=o)window.clearInterval(h),g=1;else var g=p/o;var l=n.center;for(M=0,y=r.length;M<y;++M){var m=c[M],C=m.lat-l.lat,P=m.lng-l.lng;u.push([l,new L.LatLng(l.lat+C*g,l.lng+P*g)])}a._lines.setLatLngs(u)},e)},1),this._lines.setLatLngs(u),this._map.addLayer(this._lines),n.marker&&(this._clusterMarker=n.marker.setOpacity(.3))}},_generatePointsCircle:function(n,a){var i=this.spiderfyDistanceMultiplier*this._circleFootSeparation*(2+n),f=i/this._2PI,r=this._2PI/n,u=[],d,c;for(u.length=n,d=n-1;d>=0;d--)c=this._circleStartAngle+d*r,u[d]=new L.Point(Math.round(a.x+f*Math.cos(c)),Math.round(a.y+f*Math.sin(c)));return u},_generatePointsSpiral:function(n,a){var i=this.spiderfyDistanceMultiplier*this._spiralLengthStart,f=this.spiderfyDistanceMultiplier*this._spiralFootSeparation,r=this.spiderfyDistanceMultiplier*this._spiralLengthFactor,u=0,d=[],c;for(d.length=n,c=n-1;c>=0;c--)u+=f/i+c*5e-4,d[c]=new L.Point(Math.round(a.x+i*Math.cos(u)),Math.round(a.y+i*Math.sin(u))),i+=this._2PI*r/u;return d},Unspiderfy:function(){for(var n=this,a=0,i=this._currentMarkers.length;a<i;++a)this._currentMarkers[a].setLatLng(this._currentCenter).setOpacity(0);var f=this._currentMarkers;window.setTimeout(function(){for(a=0,i=f.length;a<i;++a)n._map.removeLayer(f[a])},300),this._currentMarkers=[],this._map.removeLayer(this._lines),this._clusterMarker&&this._clusterMarker.setOpacity(1)},onRemove:function(n){this.Unspiderfy(),n.off("overlappingmarkers",this.Spiderfy,this),n.off("click",this.Unspiderfy,this),n.off("zoomend",this.Unspiderfy,this)}});var X=new pt;const at=46.561964,it=0,st=6;var rt,ot,W=Q.exports.map("map",{maxBounds:[[101,-200],[-101,180]]}).setView([at,it],st),G=document.createElement("a");G.classList.add("leaflet-control-zoom-in");G.onclick=function(){W.setView([at,it],st)};G.title="Centrer la carte";G.innerHTML="<span class='material-icons'>zoom_out_map</span>";var $=document.createElement("a");$.classList.add("leaflet-control-zoom-in");$.innerHTML="<span class='material-icons'>my_location</span>";$.onclick=function(){"geolocation"in navigator?navigator.geolocation.getCurrentPosition(function(n){try{macarte.setView([n.coords.latitude,n.coords.longitude],12)}catch{var a=function(r){W.setView([r.location.latitude,r.location.longitude],10)},i=function(r){alert("Nous n'arrivons pas \xE0 vous g\xE9olocaliser.")};geoip2.city(a,i)}}):alert("la g\xE9olocalisation n'est pas disponible sur votre navigateur.")};O(".leaflet-control-zoom").append(G);O(".leaflet-control-zoom").append($);Q.exports.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:'&copy;<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | donn\xE9es <a href="https://www.eaufrance.fr/">Eaufrance</a>'}).addTo(W);X.PrepareLeafletMarker=function(n,a){var i=Q.exports.icon({iconUrl:"./images/pin.png",iconAnchor:[24,48],iconSize:[48,48]});n.setIcon(i),n.on("click",function(){ct(a)})};function ct(n){var a=rt.filter(r=>(r==null?void 0:r.places.filter(u=>n.obj.code_station==u.code_station).length)>0),i="<h4>Esp\xE8ces pricipales</h4>";for(var f of a)i+=" - "+f.nom_commun+"<br>";O("#info-title").text(n.obj.localisation),O("#info-content").html(i),O("#info-content").append('<div id="loading-content" class="uk-text-center"><div uk-spinner></div></div>'),O.getJSON("https://hubeau.eaufrance.fr/api/v0/etat_piscicole/poissons?code_station="+n.obj.code_station+"&format=json",function(r){var u=[];if(r.data.length>0){var d="";d+="<h4>Dans cette station :</h4>",d+='<table class="uk-table uk-table-small uk-table-striped uk-table-hover uk-table-small">',d+="<thead><th>Esp\xE8ce</th><th>Quantit\xE9</th><th>Poids</th><th>Date</th></tr></thead>",r.data.sort(function(y,I){return new Date(I.date_operation)-new Date(y.date_operation)});for(var c of r.data){var M={code_espece_poisson:c.code_espece_poisson,code_station:c.code_station,nom_poisson:c.nom_poisson,effectif:c.effectif,poids:c.poids,densite:c.densite,surface_peche:c.surface_peche,date_operation:c.date_operation};console.log(M),u[c.code_espece_poisson]=M,d+="<tr><td>"+c.nom_poisson+"</td><td>"+c.effectif+"</td><td>"+c.poids+"</td><td>"+c.date_operation+"</td></tr>"}d+="</table>",O("#info-content").append(d)}O("#info-content").find("#loading-content").remove()}),ft.exports.offcanvas("#info").toggle()}O.getJSON("./fish_places.json",function(n){ot=n;for(var a of ot)setTimeout(function(i){var f=new z.Marker(i.y,i.x);f.data.obj=i,X.RegisterMarker(f)},1,a);setTimeout(()=>{W.addLayer(X),X.ProcessView(),W.invalidateSize()},1e3)});O.getJSON("./fishs.json",function(n){rt=n});O(document).ready(function(){O("#loading-screen").hide(),O("#app").show()});
