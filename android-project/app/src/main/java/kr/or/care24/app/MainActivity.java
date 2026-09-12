package kr.or.care24.app;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.widget.Toast;

public class MainActivity extends Activity {
    private static final String APP_URL = "https://ganbyeong24-bundang-snuh.samganid5197259555.chatgpt.site";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        openCare24();
    }

    private void openCare24() {
        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(APP_URL));
        intent.addCategory(Intent.CATEGORY_BROWSABLE);
        try {
            startActivity(intent);
        } catch (ActivityNotFoundException error) {
            Toast.makeText(this, "인터넷 브라우저를 찾을 수 없습니다.", Toast.LENGTH_LONG).show();
        } finally {
            finish();
        }
    }
}
