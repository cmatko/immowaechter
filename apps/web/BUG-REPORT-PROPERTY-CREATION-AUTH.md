# 🐛 **BUG REPORT: Property Creation Authentication Issue**

**Date:** 2025-01-23  
**Priority:** HIGH  
**Status:** OPEN  
**Assignee:** @user  

## **Problem Description**
User gets immediately redirected to login page when trying to create new property, even when authenticated. This happens when clicking "Neue Immobilie anlegen" button.

## **Root Cause Analysis**
1. **Route Location Issue:** Property creation page was located at `/properties/new` (outside dashboard layout)
2. **Authentication Scope:** Dashboard layout handles authentication, but `/properties/new` was not under `/dashboard`
3. **Next.js Caching:** Server was caching the old route even after file moves
4. **Session Management:** 5-minute session timeout configuration may be interfering

## **Attempted Fixes**
- [x] Moved property creation from `/properties/new` to `/dashboard/properties/new`
- [x] Updated authentication logic in dashboard layout
- [x] Cleared Next.js cache (`.next` folder)
- [x] Restarted server multiple times
- [x] Killed all Node.js processes
- [x] Removed old route directory completely

## **Current Status**
- ❌ **STILL BROKEN:** Server logs still show `GET /properties/new 200` (old route still active)
- ❌ **STILL BROKEN:** User still experiences immediate login redirect
- ✅ **NEW ROUTE:** `/dashboard/properties/new` should work but old route persists

## **Technical Details**

### **Files Modified:**
- `apps/web/app/dashboard/properties/new/page.tsx` (new location)
- `apps/web/app/properties/new/page.tsx` (deleted)
- `apps/web/app/dashboard/layout.tsx` (authentication logic)
- `apps/web/lib/supabase-client.ts` (session timeout)

### **Server Logs:**
```
GET /properties/new 200 in 746ms  # OLD ROUTE STILL ACTIVE
```

### **Authentication Flow:**
1. User clicks "Neue Immobilie anlegen"
2. Should go to `/dashboard/properties/new`
3. Dashboard layout checks authentication
4. If authenticated, show form
5. If not authenticated, redirect to `/login`

## **Next Steps (TODO)**
- [ ] **URGENT:** Verify new route `/dashboard/properties/new` is accessible
- [ ] **URGENT:** Check if old route `/properties/new` is completely removed from Next.js routing
- [ ] **URGENT:** Test authentication flow end-to-end
- [ ] Update any hardcoded links to use new route
- [ ] Add E2E tests for property creation flow
- [ ] Check browser cache and clear if necessary
- [ ] Verify Supabase session is properly maintained

## **Reproduction Steps**
1. Go to `http://localhost:3000/dashboard`
2. Click "Neue Immobilie anlegen" button
3. **Expected:** Form should load
4. **Actual:** Immediate redirect to `/login`

## **Environment**
- Next.js 14.2.33
- Supabase authentication
- 5-minute session timeout
- Windows 10, PowerShell

## **Priority:** HIGH - Blocks core functionality
## **Labels:** bug, authentication, property-creation, urgent

