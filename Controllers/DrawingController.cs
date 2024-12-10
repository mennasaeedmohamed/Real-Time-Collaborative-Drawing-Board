using Microsoft.AspNetCore.Mvc;

public class DrawingController : Controller
{
    public IActionResult Index()
    {
        return View();
    }
}
