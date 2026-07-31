<script setup lang="ts">
import { table } from 'node:console';

</script>

<template>
    <div class="page-container">
        <main class="main-content">
            <div class="guide-card">
                <h1 class="guide-title">
                    Guide Import Konversi ke SOA
                </h1>
                <p class="greeting-subtitle">
                    1. Pastikan nama kolom di file sesuai dengan salah satu yang dibutuhkan di bawah.\n2. Pilih salah satu SOA yang ada di atas (asum/finansial/kredit program).\n3. Pilih antara premi atau klaim.\n4. Mulai import (pastikan file berupa .xlsx atau .csv.)
                </p>
            </div>
            <div class="guide-asum-table">
                <table class="asum-table">
                    <tr>
                        <th>
                            Premi
                        </th>
                        <th>
                            Klaim
                        </th>
                    </tr>
                    <tr>
                        <td>
                            NO POLIS:\npolicy number, policy_number, policy_no, policy_num, no_polis, no. polis, nomor polis, nomor_polis, policynum, nopolis
                        </td>
                        <td>
                            NO POLIS:\npolicy number, policy_number, policy_no, policy_num, no_polis, no. polis, nomor polis, nomor_polis, policynum, nopolis
                        </td>
                    </tr>
                    <tr>
                        <td>
                            NO REGISTRASI:\nno_reg, no.reg, noreg, no_registrasi, no. registrasi, nomor registrasi,  nomor_registrasi, reg_no, registration_no
                        </td>
                        <td>
                            (Tidak diperlukan)
                        </td>
                    </tr>
                    <tr>
                        <td>
                            INSURED:\ninsured_name, the insured, insured, insured name
                        </td>
                        <td>
                            INSURED:\ninsured_name, the insured, insured, insured name
                        </td>
                    </tr>
                    <tr>
                        <td>
                            COB:\ncob_treaty, cob, cob treaty
                        </td>
                        <td>
                            COB:\ncob_treaty, cob, cob treaty
                        </td>
                    </tr>
                    <tr>
                        <td>
                            INCEPTION:\ninception, tgl_awal, tanggal_awal, start_date
                        </td>
                        <td>
                            INCEPTION:\ninception, tgl_awal, tanggal_awal, start_date
                        </td>
                    </tr>
                    <tr>
                        <td>
                            EXPIRY:\nexpiry, tgl_akhir, tanggal_akhir, end_date
                        </td>
                        <td>
                            EXPIRY:\nexpiry, tgl_akhir, tanggal_akhir, end_date
                        </td>
                    </tr>
                    <tr>
                        <td>
                            DOL:\ndol_date, dol
                        </td>
                        <td>
                            DOL:\ndol_date, dol
                        </td>
                    </tr>
                    <tr>
                        <td>
                            CURRENCY:\ncurrency, curr, valuta
                        </td>
                        <td>
                            CURRENCY:\ncurrency, curr, valuta
                        </td>
                    </tr>
                    <tr>
                        <td>
                            UY:\nuy_final, uy, uw_year, uw year
                        </td>
                        <td>
                            UY:\nuy_final, uy, uw_year, uw year
                        </td>
                    </tr>
                    <tr>
                        <td>
                            CLAIM AMOUNT:\nclaim_amount, claim amount, claimamount
                        </td>
                        <td>
                            TSI SHARE:\ntsi share, tsi_share, tsi
                        </td>
                    </tr>
                    <tr>
                        <td>
                            QUOTA SHARE:\nquota_share, qs, quota_share
                        </td>
                        <td>
                            QUOTA SHARE:\nquota_share, qs, quota_share
                        </td>
                    </tr>
                    <tr>
                        <td>
                            SURPLUS:\nsurplus, sp, spl
                        </td>
                        <td>
                            SURPLUS:\nsurplus, sp, spl
                        </td>
                    </tr>
                </table>
            </div>
            <div class="guide-finance-table">
                <table class="finance-table">
                    <tr>
                        <th>
                            Premi
                        </th>
                        <th>
                            Klaim
                        </th>
                    </tr>
                    <tr>
                        <td>
                            NO POLIS:\npolicy number, policy_number, policy_no, policy_num, no_polis, no. polis, nomor polis, nomor_polis, policynum, nopolis
                        </td>
                        <td>
                            NO POLIS:\npolicy number, policy_number, policy_no, policy_num, no_polis, no. polis, nomor polis, nomor_polis, policynum, nopolis
                        </td>
                    </tr>
                    <tr>
                        <td>
                            NO REGISTRASI:\nno_reg, no.reg, noreg, no_registrasi, no. registrasi, nomor registrasi,  nomor_registrasi, reg_no, registration_no
                        </td>
                        <td>
                            (Tidak diperlukan)
                        </td>
                    </tr>
                    <tr>
                        <td>
                            INSURED:\ninsured_name, the insured, insured, insured name
                        </td>
                        <td>
                            INSURED:\ninsured_name, the insured, insured, insured name
                        </td>
                    </tr>
                    <tr>
                        <td>
                            COB:\ncob_treaty, cob, cob treaty
                        </td>
                        <td>
                            COB:\ncob_treaty, cob, cob treaty
                        </td>
                    </tr>
                    <tr>
                        <td>
                            INCEPTION:\ninception, tgl_awal, tanggal_awal, start_date
                        </td>
                        <td>
                            INCEPTION:\ninception, tgl_awal, tanggal_awal, start_date
                        </td>
                    </tr>
                    <tr>
                        <td>
                            EXPIRY:\nexpiry, tgl_akhir, tanggal_akhir, end_date
                        </td>
                        <td>
                            EXPIRY:\nexpiry, tgl_akhir, tanggal_akhir, end_date
                        </td>
                    </tr>
                    <tr>
                        <td>
                            DOL:\ndol_date, dol
                        </td>
                        <td>
                            DOL:\ndol_date, dol
                        </td>
                    </tr>
                    <tr>
                        <td>
                            CURRENCY:\ncurrency, curr, valuta
                        </td>
                        <td>
                            CURRENCY:\ncurrency, curr, valuta
                        </td>
                    </tr>
                    <tr>
                        <td>
                            UY:\nuy_final, uy, uw_year, uw year
                        </td>
                        <td>
                            UY:\nuy_final, uy, uw_year, uw year
                        </td>
                    </tr>
                    <tr>
                        <td>
                            CLAIM AMOUNT:\nclaim_amount, claim amount, claimamount
                        </td>
                        <td>
                            TSI SHARE:\ntsi share, tsi_share, tsi
                        </td>
                    </tr>
                    <tr>
                        <td>
                            QUOTA SHARE:\nquota_share, qs, quota_share
                        </td>
                        <td>
                            QUOTA SHARE:\nquota_share, qs, quota_share
                        </td>
                    </tr>
                    <tr>
                        <td>
                            SURPLUS:\nsurplus, sp, spl
                        </td>
                        <td>
                            SURPLUS:\nsurplus, sp, spl
                        </td>
                    </tr>
                </table>
            </div>
            <div class="guide-kp-table">
                <table class="kp-table">
                    <tr>
                        <th>
                            Premi
                        </th>
                        <th>
                            Klaim
                        </th>
                    </tr>
                    <tr>
                        <td>
                            NO POLIS:\npolicy number, policy_number, policy_no, policy_num, no_polis, no. polis, nomor polis, nomor_polis, policynum, nopolis
                        </td>
                        <td>
                            NO POLIS:\npolicy number, policy_number, policy_no, policy_num, no_polis, no. polis, nomor polis, nomor_polis, policynum, nopolis
                        </td>
                    </tr>
                    <tr>
                        <td>
                            NO REGISTRASI:\nno_reg, no.reg, noreg, no_registrasi, no. registrasi, nomor registrasi,  nomor_registrasi, reg_no, registration_no
                        </td>
                        <td>
                            (Tidak diperlukan)
                        </td>
                    </tr>
                    <tr>
                        <td>
                            INSURED:\ninsured_name, the insured, insured, insured name
                        </td>
                        <td>
                            INSURED:\ninsured_name, the insured, insured, insured name
                        </td>
                    </tr>
                    <tr>
                        <td>
                            COB:\ncob_treaty, cob, cob treaty
                        </td>
                        <td>
                            COB:\ncob_treaty, cob, cob treaty
                        </td>
                    </tr>
                    <tr>
                        <td>
                            INCEPTION:\ninception, tgl_awal, tanggal_awal, start_date
                        </td>
                        <td>
                            INCEPTION:\ninception, tgl_awal, tanggal_awal, start_date
                        </td>
                    </tr>
                    <tr>
                        <td>
                            EXPIRY:\nexpiry, tgl_akhir, tanggal_akhir, end_date
                        </td>
                        <td>
                            EXPIRY:\nexpiry, tgl_akhir, tanggal_akhir, end_date
                        </td>
                    </tr>
                    <tr>
                        <td>
                            DOL:\ndol_date, dol
                        </td>
                        <td>
                            DOL:\ndol_date, dol
                        </td>
                    </tr>
                    <tr>
                        <td>
                            CURRENCY:\ncurrency, curr, valuta
                        </td>
                        <td>
                            CURRENCY:\ncurrency, curr, valuta
                        </td>
                    </tr>
                    <tr>
                        <td>
                            UY:\nuy_final, uy, uw_year, uw year
                        </td>
                        <td>
                            UY:\nuy_final, uy, uw_year, uw year
                        </td>
                    </tr>
                    <tr>
                        <td>
                            CLAIM AMOUNT:\nclaim_amount, claim amount, claimamount
                        </td>
                        <td>
                            TSI SHARE:\ntsi share, tsi_share, tsi
                        </td>
                    </tr>
                    <tr>
                        <td>
                            QUOTA SHARE:\nquota_share, qs, quota_share
                        </td>
                        <td>
                            QUOTA SHARE:\nquota_share, qs, quota_share
                        </td>
                    </tr>
                    <tr>
                        <td>
                            SURPLUS:\nsurplus, sp, spl
                        </td>
                        <td>
                            SURPLUS:\nsurplus, sp, spl
                        </td>
                    </tr>
                </table>
            </div>
        </main>
    </div>
</template>